export const platformStats = [
  { label: 'Setup time', value: '5 min' },
  { label: 'Live results', value: '100%' },
  { label: 'Ballots tracked', value: '24/7' },
];

export const features = [
  {
    icon: 'pi pi-shield',
    title: 'Clear ballot flow',
    description: 'Voters see the active choice, select once, and get immediate confirmation.',
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Live result view',
    description: 'Every submitted vote updates the dashboard without making the count feel noisy.',
  },
  {
    icon: 'pi pi-bolt',
    title: 'Fast to launch',
    description: 'A lean FastAPI backend and Vue frontend keep the stack simple to run and extend.',
  },
];

export const processSteps = ['Create poll', 'Share ballot', 'Watch results'];

export const faqs = [
  {
    question: 'Can users switch between different votes?',
    answer: 'Yes. Explore shows every poll returned by the backend, and users can open any active vote from the card list.',
  },
  {
    question: 'Are results updated after voting?',
    answer: 'Yes. After a vote is submitted, the frontend refreshes the active poll data and updates the result bars immediately.',
  },
  {
    question: 'Does this app store votes permanently?',
    answer: 'The current demo backend keeps votes in memory, so data resets when the FastAPI server restarts.',
  },
  {
    question: 'Can more polls be added later?',
    answer: 'Yes. Use the Create page to save a new vote to the backend and publish it into Explore.',
  },
];

export const navItems = [
  { key: 'home', label: 'Home', icon: 'pi pi-home', to: '/' },
  { key: 'explore', label: 'Events', icon: 'pi pi-compass', to: '/events' },
  { key: 'create', label: 'Create', icon: 'pi pi-plus-circle', to: '/create' },
];
