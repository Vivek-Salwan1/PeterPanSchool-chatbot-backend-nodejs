const SCHOOLS = [
  { label: 'Peter Pan Academy', value: 'peter-pan-academy' },
  { label: "Little Seeds Children's Center", value: 'little-seeds' },
  { label: 'Peter Pan Preschool', value: 'peter-pan-preschool' },
];

const TIME_SLOTS = [
  { label: '9:00 AM – 11:00 AM', value: '09:00-11:00' },
  { label: '2:00 PM – 4:00 PM', value: '14:00-16:00' },
];

const GREETING_PATTERN =
  /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i;

const STEPS = {
  IDLE: 'idle',
  ASK_NAME: 'ask_name',
  ASK_MOBILE: 'ask_mobile',
  ASK_HELP: 'ask_help',
  TOUR_EMAIL: 'tour_email',
  TOUR_CHILD_AGE: 'tour_child_age',
  TOUR_SCHOOL: 'tour_school',
  TOUR_DATE: 'tour_date',
  TOUR_TIME: 'tour_time',
  TOUR_CONFIRM: 'tour_confirm',
  COMPLETED: 'completed',
};

module.exports = {
  SCHOOLS,
  TIME_SLOTS,
  GREETING_PATTERN,
  STEPS,
};
