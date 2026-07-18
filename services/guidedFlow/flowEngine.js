const { SCHOOLS, TIME_SLOTS, GREETING_PATTERN, STEPS } = require('./constants');
const { createSession, getSession, saveTourBooking } = require('./sessions');
const {
  isValidName,
  isValidMobile,
  isValidEmail,
  isValidChildAge,
  isValidDate,
} = require('./validators');

function getSchoolLabel(value) {
  return SCHOOLS.find((school) => school.value === value)?.label || value;
}

function getTimeLabel(value) {
  return TIME_SLOTS.find((slot) => slot.value === value)?.label || value;
}

function formatDateLabel(value) {
  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return value;
  }
}

function buildResponse(session, reply, ui = null, extra = {}) {
  return {
    success: true,
    sessionId: session.id,
    step: session.step,
    reply,
    ui,
    data: session.data,
    flowActive: session.step !== STEPS.COMPLETED && session.step !== STEPS.IDLE,
    ...extra,
  };
}

function welcomeResponse(session) {
  session.step = STEPS.ASK_NAME;
  return buildResponse(
    session,
    "Hi 👋 Welcome to Peter Pan Schools!\n\nI'm Buddy, your virtual admissions assistant.\n\nMay I know your name?",
    {
      type: 'text',
      inputMode: 'text',
      placeholder: 'Enter your name',
    }
  );
}

function askMobileResponse(session) {
  session.step = STEPS.ASK_MOBILE;
  return buildResponse(
    session,
    `Nice to meet you, ${session.data.name} 😊\n\nCould you please share your mobile number?`,
    {
      type: 'text',
      inputMode: 'tel',
      placeholder: '10-digit mobile number',
    }
  );
}

function askHelpResponse(session) {
  session.step = STEPS.ASK_HELP;
  return buildResponse(
    session,
    'Thank you!\n\nHow can I help you today?',
    {
      type: 'buttons',
      buttons: [
        { label: 'Schedule a Tour', value: 'schedule_tour' },
        { label: 'Admission Enquiry', value: 'admission_enquiry' },
        { label: 'Other', value: 'other' },
      ],
    }
  );
}

function tourEmailResponse(session) {
  session.step = STEPS.TOUR_EMAIL;
  return buildResponse(session, 'Great! Let’s schedule your tour.\n\nPlease share your email address.', {
    type: 'text',
    inputMode: 'email',
    placeholder: 'your@email.com',
  });
}

function tourChildAgeResponse(session) {
  session.step = STEPS.TOUR_CHILD_AGE;
  return buildResponse(session, 'What is your child’s age?', {
    type: 'text',
    inputMode: 'text',
    placeholder: 'e.g. 3 or 3 years',
  });
}

function tourSchoolResponse(session) {
  session.step = STEPS.TOUR_SCHOOL;
  return buildResponse(session, 'Which school would you prefer to visit?', {
    type: 'dropdown',
    label: 'Preferred School',
    options: SCHOOLS,
  });
}

function tourDateResponse(session) {
  session.step = STEPS.TOUR_DATE;
  const today = new Date().toISOString().slice(0, 10);
  return buildResponse(session, 'Please choose your preferred tour date.', {
    type: 'date',
    label: 'Preferred Date',
    min: today,
  });
}

function tourTimeResponse(session) {
  session.step = STEPS.TOUR_TIME;
  return buildResponse(session, 'Please select a preferred time slot.', {
    type: 'time_slots',
    slots: TIME_SLOTS,
  });
}

function tourConfirmResponse(session) {
  session.step = STEPS.TOUR_CONFIRM;
  return buildResponse(
    session,
    'Please confirm your tour details:',
    {
      type: 'confirm',
      summary: {
        name: session.data.name,
        mobile: session.data.mobile,
        email: session.data.email,
        childAge: session.data.childAge,
        school: getSchoolLabel(session.data.school),
        preferredDate: formatDateLabel(session.data.preferredDate),
        preferredTime: getTimeLabel(session.data.preferredTime),
      },
      buttons: [
        { label: 'Confirm', value: 'confirm_tour' },
        { label: 'Start Over', value: 'start_over' },
      ],
    }
  );
}

function completeTourResponse(session, booking) {
  session.step = STEPS.COMPLETED;
  return buildResponse(
    session,
    `Your tour request has been confirmed! 🎉\n\nWe look forward to welcoming you to ${getSchoolLabel(booking.school)} on ${formatDateLabel(booking.preferredDate)} at ${getTimeLabel(booking.preferredTime)}.\n\nOur team will contact you at ${booking.mobile} if needed.`,
    { type: 'none' },
    { flowActive: false, bookingId: booking.id }
  );
}

function admissionEnquiryResponse(session) {
  session.step = STEPS.COMPLETED;
  return buildResponse(
    session,
    `Thank you, ${session.data.name}! Our admissions team will reach out to you at ${session.data.mobile}.\n\nYou can also visit our Admissions page for more details.`,
    {
      type: 'link',
      label: 'View Admissions',
      href: '/admissions',
    },
    { flowActive: false }
  );
}

function otherChatResponse(session) {
  session.step = STEPS.COMPLETED;
  session.data.helpChoice = 'other';
  return buildResponse(
    session,
    `Sure, ${session.data.name}! Feel free to ask me anything about Peter Pan Schools — programs, hours, locations, and more.`,
    { type: 'none' },
    { flowActive: false, useAi: true }
  );
}

function processGuidedFlow({ sessionId, message = '', action = null }) {
  let session = getSession(sessionId);

  if (action?.type === 'start_over') {
    session = createSession();
    return welcomeResponse(session);
  }

  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!session) {
    if (!trimmedMessage || !GREETING_PATTERN.test(trimmedMessage)) {
      return {
        success: true,
        sessionId: null,
        step: STEPS.IDLE,
        reply: null,
        ui: null,
        flowActive: false,
        useAi: true,
      };
    }
    session = createSession();
    return welcomeResponse(session);
  }

  if (session.step === STEPS.COMPLETED) {
    if (GREETING_PATTERN.test(trimmedMessage)) {
      session = createSession();
      return welcomeResponse(session);
    }
    return {
      success: true,
      sessionId: session.id,
      step: session.step,
      reply: null,
      ui: null,
      flowActive: false,
      useAi: true,
    };
  }

  if (action?.type === 'button') {
    if (session.step === STEPS.ASK_HELP) {
      if (action.value === 'schedule_tour') {
        session.data.helpChoice = 'schedule_tour';
        return tourEmailResponse(session);
      }
      if (action.value === 'admission_enquiry') {
        session.data.helpChoice = 'admission_enquiry';
        return admissionEnquiryResponse(session);
      }
      if (action.value === 'other') {
        return otherChatResponse(session);
      }
    }

    if (session.step === STEPS.TOUR_CONFIRM) {
      if (action.value === 'confirm_tour') {
        const booking = saveTourBooking({ ...session.data });
        return completeTourResponse(session, booking);
      }
      if (action.value === 'start_over') {
        session = createSession();
        return welcomeResponse(session);
      }
    }
  }

  if (action?.type === 'dropdown' && session.step === STEPS.TOUR_SCHOOL) {
    const school = SCHOOLS.find((item) => item.value === action.value);
    if (!school) {
      return buildResponse(session, 'Please select a valid school from the list.', tourSchoolResponse(session).ui);
    }
    session.data.school = school.value;
    return tourDateResponse(session);
  }

  if (action?.type === 'date' && session.step === STEPS.TOUR_DATE) {
    if (!isValidDate(action.value)) {
      return buildResponse(session, 'Please choose a valid future date.', tourDateResponse(session).ui);
    }
    session.data.preferredDate = action.value;
    return tourTimeResponse(session);
  }

  if (action?.type === 'time_slot' && session.step === STEPS.TOUR_TIME) {
    const slot = TIME_SLOTS.find((item) => item.value === action.value);
    if (!slot) {
      return buildResponse(session, 'Please select one of the available time slots.', tourTimeResponse(session).ui);
    }
    session.data.preferredTime = slot.value;
    return tourConfirmResponse(session);
  }

  if (!trimmedMessage) {
    return buildResponse(session, 'Please provide a response to continue.', null);
  }

  switch (session.step) {
    case STEPS.ASK_NAME:
      if (!isValidName(trimmedMessage)) {
        return buildResponse(
          session,
          'Please enter a valid name (at least 2 letters).',
          welcomeResponse(session).ui
        );
      }
      session.data.name = trimmedMessage;
      return askMobileResponse(session);

    case STEPS.ASK_MOBILE:
      if (!isValidMobile(trimmedMessage)) {
        return buildResponse(
          session,
          'Please enter a valid 10-digit mobile number.',
          askMobileResponse(session).ui
        );
      }
      session.data.mobile = trimmedMessage.replace(/\D/g, '');
      return askHelpResponse(session);

    case STEPS.TOUR_EMAIL:
      if (!isValidEmail(trimmedMessage)) {
        return buildResponse(session, 'Please enter a valid email address.', tourEmailResponse(session).ui);
      }
      session.data.email = trimmedMessage;
      return tourChildAgeResponse(session);

    case STEPS.TOUR_CHILD_AGE:
      if (!isValidChildAge(trimmedMessage)) {
        return buildResponse(
          session,
          'Please enter a valid child age (0–6 years).',
          tourChildAgeResponse(session).ui
        );
      }
      session.data.childAge = trimmedMessage;
      return tourSchoolResponse(session);

    default:
      return buildResponse(session, 'Please use the options provided to continue.', null);
  }
}

module.exports = {
  processGuidedFlow,
};
