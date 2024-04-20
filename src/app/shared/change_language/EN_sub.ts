const currency = {
  thb: 'THB',
  usd: 'USD',
}

const inputPoint = {
  input: 'Enter points',
  point: 'Points',
  currency,
}

const usagePriceOnLandingPage = {
  box1: {
    title: [
      'Create audio starting at',
      [1, ' / 40 Characters'],
      ['(Average ', 10, ' / 1 Minute)'],
    ],
    btn: 'Buy Points',
    paper: ['Text Conversion', '1 A4 (1,600 Characters)', ['≈ ', 40]],
    social: [
      'Create TikTok Clips',
      '30 seconds (250 Characters)',
      ['≈ ', 6],
    ],
    media: [
      'Narrate Movie Clips',
      '15 minutes (7,500 Characters)',
      ['≈ ', 185],
    ],
  },
  box2: {
    title: ['Buy More, Save More', 'Up to 40% Off'],
    btn: 'More Details',
  },
}

export const sub = {
  inputPoint,
  currency,
  usagePriceOnLandingPage
}
