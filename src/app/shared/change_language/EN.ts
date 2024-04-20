import { TErrorMessageMapping } from 'src/app/auth/models/auth-model';
import { sub } from './EN_sub';
import { TFirebaseAuth } from 'src/app/firebase-auth/models/firebase-auth-model';
const { inputPoint, currency, usagePriceOnLandingPage } = sub;

const Navbar = [
  {
    logout: 'Logout',
    login: 'LOG IN',
    try_free: "LET'S TRY FREE",
    point: 'Point',
    tutorial: 'Tutorial',
    navbar_item: ['STUDIO', 'VOICE OVER', 'USAGE', 'API', 'PRICE', 'VOICE BOT'],
    studioMenuItem: ['Video', 'Document'],
    menu_navbar: [
      [
        'My Account',
        'My Packages',
        'Voice Storage',
        'Record Voice',
        'Invite Friends',
        'Redeem Code',
        'Sales Dashboard',
      ],
      ['Report problem', 'Delete Account'],
    ],
  },
];

const LandingPage = [
  {
    carousel: {
      header: {
        h1: 'Botnoi Voice',
        h2: 'Turn your text into natural sounding voices',
        btn_and_input: {
          ex_sound: 'Sound Sample',
          intro_clip: 'Introduction Video',
          text_placeholder: 'Try it Out',
        },
      },
      footer: {
        text: 'Make Your Work Outstanding',
        button: 'Voice Studio',
      },
      personlist: [
        {
          id: '5',
          img: 'Alan-png',
          greeting: 'Meet ',
          presentname: 'Alan,',
          description:
            'The perfect male AI voice artist for captivating storytelling and engaging news reading on your website.',
          exam_sound:
            'https://dauk9xw0949zx.cloudfront.net/picture/alan/sound_1_alan.wav',
          url: 'https://youtu.be/mRo9DB0k7II',
        },
        {
          id: '1',
          img: 'Ava-png-resize',
          greeting: 'Meet ',
          presentname: 'Eva,',
          description:
            'The perfect female AI voice artist for captivating storytelling and engaging news reading on your website.',
          exam_sound:
            'https://dauk9xw0949zx.cloudfront.net/picture/ava/sound_1_ava.wav',
          url: 'https://www.youtube.com/watch?v=qeUnVl0t53k&t',
        },
        {
          id: '2',
          img: 'Bow-png-resize',
          greeting: 'Meet ',
          presentname: 'Bo,',
          description:
            'The perfect girl AI voice artist for captivating storytelling and engaging news reading on your website.',
          exam_sound:
            'https://dauk9xw0949zx.cloudfront.net/picture/bow/sound_1_bow.wav',
          url: 'https://www.youtube.com/watch?v=w0DC3Wx2Y4A',
        },
      ],
    },
    point_content: {
      ...usagePriceOnLandingPage,
    },
    creative_work: {
      news_and_video: {
        header_1: 'Discover More ',
        header_2: 'About Us From Our News and Introduction Video.',
      },
      menu_jump: {
        news: 'News',
        ex_sound: 'Listen to Voice-Over Demo',
        incentive: 'Benefits for You',
        handbook: 'How to Use',
        review: 'Our User Review',
        video_player: 'Examples of usage',
        customer: 'Our customer',
        contact_us: 'Contact Us',
      },
      nameMenu: [
        'News',
        // 'Listen to Voice Over Samples',
        'Listen Voice Over',
        'Benefits for You',
        'How to Use',
        'Our User Review',
        'Examples of usage',
        'Our customer',
        'Contact Us',
      ],
    },
    sound_sample: {
      heading_text_h2_1: 'Let',
      heading_text_p: 'Botnoi Voice',
      heading_text_h2_2: 'help you create content',
      subheading_text_h2_1: 'With the quality file &',
      subheading_text_p: 'variety of languages',
      text_text_1: 'Voice actor in',
      text_text_2: 'Thai-English',
      text_text_3: 'and ',
      text_text_4: 'other languages',
      text_text_5: '',
      text_text_6: 'up to 10 languages',
      text_text_7: '(China,Japan,Vietnam,Laos,Myanmar,Indonesia,etc.)',
      text_btn: 'Try now',
      maleSpeker_List: [
        'Alan',
        'Uncle Warm',
        'Chris',
        'Smoke ',
        'Mr.Bread',
        'Poo-Yai Lee',
        'Teddy',
      ],
      femaleSpeaker_List: [
        'Ava',
        'Bow',
        'Siren',
        'Nadia',
        'Vanilla',
        'Ajarn Lin',
        'Khaotok',
      ],
      allSpeaker_List: [
        'Alan',
        'Uncle Warm',
        'Chris',
        'Smoke ',
        'Mr.Bread',
        'Poo-Yai Lee',
        'Teddy',
        'Ava',
        'Bow',
        'Siren',
        'Nadia',
        'Vanilla',
        'Ajarn Lin',
        'Khaotok',
      ],
      anotherVoiceover: 'See more voice over lists',

      categories: 'Voice Over Category',
      lists: 'Voice Over List',
      text: 'text', //*********  */
      imgNames: [
        'Popular',
        'Narrating',
        'Drama Voice Over',
        'Anime Voice Over',
        'Other accents ',
        'General',
        'News Reading',
      ],
      tagNames: {
        NewsStyle: 'News Reading Style',
        StorytellingStyle: 'Storytelling Style',
        AdvertiseSpotStyle: 'Advertising Spot Style',
        DocumentaraStyle: 'Documentary Style',
        DescribeStyle: 'Narrating Style',
        FableStyle: 'Taletelling Style',
        TeacherStyle: 'Teaching Style',
        CharacterStyle: 'Character Style',
        AnimeStyle: 'Anime Style',
        LocalStyle: 'Local Style',
        ForeignVoiceStyle: 'Foreign Voice Style',
      },
    },
    studio: {
      heading: {
        text_1: 'Let your creations continue with',
        text_highlight: 'Studio',
      },
    },
    use_work: {
      text1_creative_work: {
        text_left: 'How can',
        text_center_1: 'quality',
        text_center_2: 'Voice-Over',
        text_right: 'benefit you?',
      },
      text_grid_item: [
        {
          p: 'Help you … ',
          h3: 'Become more professional',
          text_on_pc: {
            h4_t1: 'It brings you a higher level of professional, cutting-edge',
            h4_t2: 'and intriguing work piece ',
          },
          text_on_mobile:
            'It brings you a higher level of professional, cutting-edge, and intriguing work piece',
        },
        {
          p: 'Offer you … ',
          h3: 'Time and cost savings',
          text_on_pc: {
            h4_t1:
              'You can generate high-quality voice over at a reasonable price',
            h4_t2:
              ' within a short time at your most convenience, ease, and quick grasp',
          },
          text_on_mobile:
            'You can generate high-quality voice over at a reasonable price within a short time at your most convenience, ease, and quick grasp',
        },
        {
          p: 'Boost you … ',
          h3: 'More likes, shares and followers',
          text_on_pc: {
            h4_t1:
              'It makes your content more distinctive and engaging to your audiences,',
            h4_t2: 'as well as gaining more likes, shares and followers ',
          },
          text_on_mobile:
            'It makes your content more distinctive and engaging to your audience, as well as gaining more likes, shares and followers ',
        },
        {
          p: 'Allow you … ',
          h3: 'To work more freely and flexibly',
          text_on_pc: {
            h4_t1:
              'You can edit and customize your text-to-speech however you want',
            h4_t2: ' as our features are designed to be flexible for all users',
          },
          text_on_mobile:
            'You can edit and customize your text-to-speech however you want as our features are designed to be flexible for all users.',
        },
      ],
    },
    four_step: {
      topic_1: 'Simple Steps, Convenient, Time and Effort Saving ',
      topic_2: 'Give you time to come up with spectacular content idea',
      title: 'Just 3 Easy Steps ',
      step: [
        {
          title: 'STEP 1',
          description: 'Enter or paste your text ',
        },
        {
          title: 'STEP 2',
          description:
            'Highlight the text that you want to generate voice audio ',
        },
        {
          title: 'STEP 3',
          description: 'Set up sound from Pop - up Function',
        },
        {
          title: 'STEP 4',
          description: 'Download the audio file',
        },
      ],
    },
    feedback: {
      title_1: 'Feedback',
      title_2: 'From actual users',
      title_3: 'Good quality, reliable',
      feedback_item: [
        // can chang item detail on this
        {
          name: 'Anupong Awachai',
          position: 'CTO of ANC Brokerage Company Limited',
          description:
            "I remember the first time Dr. Winn sent me a chatbot tutorial YouTube link. I didn’t realize that it wasn't a human voice until he told me it’s an AI synthetic voice dubbing in that video. I got back to listen to it again and told him if he hadn't told me, I wouldn't have caught it because the voice over was seamlessly like a human voice.",
          image: '../../../assets/images/feedback/feedback1.webp',
        },
        {
          name: 'Sitichoke Jitprasong',
          position: 'Information Technology Manager',
          company: 'Peerapat Technology Public Company Limited',
          description:
            'Botnoi Voice is a Thai voice synthesizer that sounds very close to human voices. It speaks and reads Thai naturally and is easy to understand. The voice quality is good for a relatively simple presentation.',
          image: '../../../assets/images/feedback/feedback2.webp',
        },
        {
          name: 'Toy Kasidis',
          position: 'Data Analyst, owner of the DataRockie Facebook Page',
          description:
            'These are AI synthesized voices from Thai developers that are very natural. They can be applied to a variety of customer service domains.',
          image: '../../../assets/images/feedback/feedback3.webp',
        },
        {
          name: 'Yo-Yo',
          position: 'Working in lectures and writing health-related content',
          description:
            'Easy to use, good for noise-sensitive voice recorders. Even if your neighbor is wrecking a building or drilling hard cement, your voice-over generating will be problem-free. Botnoi Voice facilitate you to create voice presentation anytime, anywhere.',
          image: '../../../assets/images/feedback/feedback4.webp',
        },
      ],
    },
    apply_work: {
      title_1: 'Enable you to apply with a wide range of potential uses',
      title_2: 'Flexible for all users',
      item_contain: [
        {
          src: 'https://www.youtube.com/embed/IG-IU25OZ2A',
          title: 'YouTube video player',
          description: 'Botnoi Ghost Story',
        },
        {
          src: 'https://www.youtube.com/embed/uJp_D0-DD7A',
          title: 'YouTube video player',
          description: 'Botnoi News Reporting',
        },
        {
          src: 'https://www.youtube.com/embed/g5m6zmeYo8M',
          title: 'YouTube video player',
          description: 'Botnoi X Chatbot Tutorial',
        },
      ],
    },
    patform_customers: {
      headtext: 'Our Customers',
      subtext: 'From various organizations',
    },
    aboutus: {
      left: {
        topic: 'Contact Us',
        title: 'Consult on AI voice generating',
        informations: {
          local: 'Company Address',
          email: 'Contact email',
          phone: 'Contact Sales',
          website: 'Website',
          social: 'Social media',
        },
      },
      right: {
        input_1: 'First name - Last name',
        input_2: 'Company',
        input_3: 'Email',
        input_4: 'Phone Number',
        input_5: 'Division',
        input_6: 'Position',
        input_7: 'Subject',
        input_8: 'More details',
        submit: 'Submit',
        addFriends: 'Add friends',
        or: 'or',
      },
    },
    footer: {
      left: 'BY iBOTNOI',
      right: 'Privacy Policy',
      right_2: 'Agreement',
    },
  },
];

const text2speech = [
  {
    mark: 'Report problem',
    downloading: 'Processing',
    note: 'Note',
    pinned:
      'Terms and Conditions: Speech Synthesis developed by Botnoi Voice is permitted for users who use our AI voice for commercial purposes without infringing or violating any law, as well as defaming or damaging any third-party privacy and right.',
    pinned_link: 'Learn More',
    modeChange: 'Voice Studio',

    notfoundWord: ['respond' + 'implied in the text'],

    importexport_t2s: {
      err_redirect: {
        wrong_file_form: 'Please enter .csv file format',
      },
      import_file: 'Import File',
      export_file: 'Export File',
    },
    storage: {
      full_storage: ['Full Storage! Please remove some audio files', 'Storage'],
    },
    btn_save: 'Save Project',
    conver_mode: {
      placeholder: 'Enter text to generate voice',
      listening: 'Listen',
      share_: 'Share',
      add_word: 'Add a sentence',
      type_word: 'Enter text to create sound',
      text_exceed: 'Text exceeds the limit',
      add_quota: 'Add quota',
      err_redirect: {
        not_select_voiceover:
          'Please select a voiceover before generating voice',
        len_message_overlimit: 'Number of texts generated exceed the limit',
        alertSeleted: 'Please select a voiceover before creating.',
      },
      quota: {
        no_point: 'Sorry, the points are insufficient for the transaction.',
        success: 'Transaction complete',
      },
      ads: {
        play_ads: 'Ads playing',
      },
      toolbar: {
        edit_: 'Edit',
        generate: 'Generate',
        select_voiceover: 'Select Voice',
        download: 'Download',
        normal: 'Normal',
        soundVolume: 'Volume',
        soundSpeed: 'Select Speed',
        soundLang: 'Select Language',
        close: 'Close box',
        point: 'Points',
        bath: 'USD',
        downloadBtnText: 'Download',
        err_redirect: {
          not_select_voiceover:
            'Please select a voice over before generating voice',
        },
        mainLang: 'Main Language',
        addonsLang: 'Additional Language',
        cutTextHover: 'Text Division: Divide text into new sound containers',
        delayHover:
          'Speech Delay: Add a delay in speech at the desired position in the sentence',
        quotaUsedText: 'Used ',
        quotaTooltip:
          'Add Quota: Press the +Add Quota button to use 100 points and immediately receive all quotas back',
        playQuotaTooltip: [
          'Play quota will be limited per day according to each package',
          'You can download audio to reclaim your quota',
          'Or subscribe to a higher package to receive a larger quota',
          'Or wait for 24 hours to reset again',
          'Or press the + top-up button to use 100 points and immediately exchange for all the quota back',
        ],
      },
      alert: [
        {
          header: 'Add Quota',
          details:
            'Do you want to use 100 points to reset play quota immediately ?',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        {
          header: 'Text exceeds the limit',
          details_1: 'Your current package is ',
          details_2: ' Audio generation is currently limited to',
          details_3: ' characters',
          promotion: ['A package for you!', 'Raise the character limit'],
          advantage: {
            text_limit: ['Generate Audio ', ' characters/box'],
            point: ['Free ', ' Points'],
          },
          cancel: 'Understand',
          confirm: 'Apply',
          currency: 'USD',
          month: 'month',
        },
        {
          header: "You don't have enough points",
          details:
            "You don't have enough points. Do you want to purchase additional points?",
          cancel: 'Cancel',
          confirm: 'Buy points',
        },
        {
          header: 'Project cannot be saved',
          details:
            'Because your current package is the Free package, you cannot save projects. If you want to save projects, please upgrade your package',
          cancel: 'Understand',
          confirm: 'Upgrade',
        },
        {
          header: 'Play quota limit reached',
          detail_1: ' Your current package is',
          detail_2: ', which is limited to',
          detail_3: 'characters',
          sub_detail_1: 'You can download sounds to reclaim your quota',
          sub_detail_2: 'Or subscribe to a higher package to get more quota',
          sub_detail_3: 'Or or after midnight the next day for reset',
          sub_detail_4:
            "Or press the button 'Use 100 points' below to reset all quotas immediately",
          upgrade: 'Upgrade',
          reset: 'Use 100 points',
        },
        {
          header: 'Start Your 1-Day Free Trial Today!',
          details:
            'Unlock our premium service with a 1-day free trial for free.',
          cancel: 'Cancel',
          confirm: 'Try now',
        },
      ],
      snackbar: [
        {
          sound_success: 'Sound generated successfully',
          sound_error: 'Unable to generate sound',
        },
      ],
    },
    play_download: {
      total_pay_point: 'Total Point to Pay',
      point: 'Points',
      createSound: 'Generate',
      playAll: 'Play All',
      pauseAll: 'Pause All',
      downloadAll: 'Download All',
      currency: 'USD',
    },
    panel_replaceword: {
      title: 'Edit Misreading',
      writing: 'Spelling',
      ex_writing: 'Such as chicken',
      reading: 'Pronunciation',
      ex_reading: 'Such as chick',
      writing_: 'Enter Spelling',
      reading_: 'Enter Pronunciation',
      addWord: 'Add More Words',
      save: 'Save',
      history_edit: 'Edit History',
      currency: 'USD',
      viewAll: 'View all',
      toV1: 'Use an older version studio.',
      card: {
        header: 'Are ads annoying',
        detail: 'Sign up for the No Ads package to mute ads',
        btn: 'Subscribe',
      },
      err_redirect: {
        no_history: 'No Edit History Found',
      },
      play_download: {
        total_pay_point: 'Download all voices',
        point: 'Points',
        createSound: 'Generate',
        playAll: 'Play All',
        pauseAll: 'Pause All',
        downloadAll: 'Download All',
      },
      monthly_point: {
        text: 'Monthly Points',
        tip: 'Monthly Points refers to the points that are awarded for free every month based on membership level. When downloading, the monthly points will be deducted first. If the monthly points are depleted, the main points will be deducted as usual.',
      },
      tools: {
        title: 'Import/Export',
        info: 'Supported file types .csv',
      },
      subscription: {
        title: 'Subscription',
      },
      play_quota: {
        text: 'Play quota',
        tip: 'The number of letters for creating sound will be limited to the usage per day according to the package. You can click to download audio to return some of your quota or wait after midnight for automatic reset',
        btn_add: 'Add Play Quota',
        add: 'Add',
        exceed: 'Play quota exceeded',
        dialog: {
          reset: 'Use 100 points to increase your quota?',
          yes: 'Confirm',
          no: 'Cancel',
          title: 'Add Play Quota',
          no_point: 'Sorry, the points are insufficient for the transaction.',
          success: 'Transaction complete',
        },
      },

      form_add: {
        title: 'Add Play Quota',
        label: 'The maximum amount of quota that can be added is',
        placeholder: 'Enter the point amount.',
        btn: 'OK',
      },
      survey: {
        text: 'Complete survey, get 1,200 points free.',
      },
    },
    toolbar_dropdown: {
      topic: 'Please select a voice over before generating voice',
      downloading: 'Downloading',
      listening: 'Listen',
      pause: 'Pause',
      selecVoiceover: ' Select Voice Over',
      speedTooltip: 'Speed',
      volumeTooltip: 'Volume',
      normal: 'Normal',
      generate: 'Generate',
      save: 'Save',
    },
    err_redirect: {
      storage_full: 'Your storage is full! Please free up some space',
      not_found_word_front: 'We can’t find',
      not_found_word_back: 'in the message',
    },
    workspace: {
      project: 'Project',
      view: 'View project',
      create: 'Create project',
    },
  },
];

const feedback_form = [
  {
    header: {
      title: 'Report Problem',
    },
    data_form: {
      title: 'Subject',
      voiceover: 'Voice over that found a problem ',
      word: 'Typed sentence that found a problem',
      problemMessage: 'Details',
      enterName: 'First name - Last name',
      phone: 'Phone Number',
      email: 'Contact email',
      category: [
        'Top-up issues',
        'General issues',
        'Suggestions & feedback',
        'Voice issues',
      ],
      to_facebook:
        'You can contact us at the Facebook page named Botnoi Voice - Text To Speech',
    },
    err_redirect: {
      select_topic: 'Please select a topic',
      select_voiceover: 'Please enter voice over',
      enter_word: 'Please enter sentence',
      problem_message: 'Problem',
      img_button: 'Attach file',
      note: 'Note : Please attach an image file or payment slip. (Not required)',
      not_enter_name: 'Please enter your first and last name',
      not_enter_phone: 'Please enter a contact phone number',
      not_enter_email: 'Please enter your contact email address',
      submit: 'Submit Problem Report',
    },
    alertText: {
      successSending: 'Successfully submitted',
    },
  },
];

const word_store = [
  {
    topic_word: 'Dictionary',
    addWrongWord: 'Add',
    searching: 'Search',
    searchingWord: 'Search Spelling',
    dateTime: ['date/month/year', ''],
    reading: 'Pronunciation',
    writing: 'Spelling',
    edit_writing: 'Modified Pronunciation',
    listening: 'Listen',
    liste: 'Listen',
    edit: 'Edit',
    accept: 'OK',
    cancel: 'Cancel',
    delete: 'Delete',
    remove: 'Remove',
    err_redirect: {
      not_found: 'Not found',
    },
  },
];

const audio_storage = [
  {
    main: {
      header: {
        text: 'My Audio Library',
        storage: {
          left: {
            storage_text: 'Storage',
            not_display: 'Not display',
          },
          right: ['Used', 'from'],
        },
      },
      body: {
        title: 'All audio files',
        upload: 'Upload',
        page: 'Page',
        see_word: 'View message',
        closeWindow: 'Close this window',
        copytext: 'Copy Text',
        action_before: '',
        clean_choice: 'Clear Choice',
        bt_matTooltip: 'Download audio file',
        download: 'Download',
        delete: 'Delete',
        deleteAll: 'Delete All',
        temp: ['Select all (page ', ')'],
      },
    },
    floating_message: {},
  },
];

const wallet = [
  {
    main_text_PromotionFirst: [
      'Grand Opening Promotion',
      'Today - 30 October 2021',
    ],
    main_text_PromotionSecord:
      ' Sign-in the website for the first time, buy points now and get extra bonus',
    my_point: 'Your Points',
    my_package: 'Membership',
    noted: 'Request a tax invoice',
    clicke: 'Click Here',
    problem: 'Points are missing',
    input_point: 'Please enter the point amounts you want',
    input_point_tip:
      'This is because the number of points you enter is equal to the number of other points paid for the same price. The system therefore has to round off the number of points automatically for the value of buying points',
    bath: 'USD',
    point: 'points',
    promotin_show: 'Get extra bonus',
    navigate: [
      'Buy Points',
      'Add-on',
      'Invite Friends',
      'Record Voice',
      'Redeem Code',
    ],
    total: ['Average ', ' USD'],
    buy_points: {
      title: 'The more you buy, the better it is',
      sub_title: ['From regular price 40 points / ', 1],
      event_sub_title: 'Limited quantity, hurry and buy now!',
      title_input: 'Buy custom points',
      ...inputPoint,
      toggle_list: ['Starter', 'Hobby', 'Professional', 'Buffet'],
      tag_list: ['Starter', 'Regular', 'Professional', 'Buffet'],
      tag_sale_event: 'PROMOTION limited 1/1',
      more: 'More price',
      discount_list: [
        {},
        {
          text: 'Worth',
          discount: '35% off',
        },
        {
          text: 'Worth',
          discount: '50% off',
        },
        {
          text: 'Worth',
          discount: '40% off',
        },
      ],
      description_list: [
        'Tiktok videos, presentation slides, Finish these tasks for low-priced',
        'Affordable price for tough tasks like translating movies or presenting news.',
        'Ultimate price-worthy point. Complete audio book and numerous video contents with value price',
        'Unlimited downloads, ad-free, exclusive on the platform, no API.',
      ],
      unlimited_desc: '*Unlimited download promotion, no API',
      buy: 'Purchase',
      free_gift: ['Free ', ' month'],
      unlimited: 'Unlimited',
      day: 'days',
      worth: 'Worthy',
      discount: 'within',
      rank: ['Your package: ', ' Get extra point when purchasing'],
      no_point: ['Seeking more points? More worthy promotion is on', 'Next'],
      back: 'Back',
    },
    recommend_popup: {
      header: 'Worth more',
      text: 'If purchasing a package of',
      text2: 'Plus',
      bonus: 'get a special bonus, free',
      ask: 'Switch to our recommended package?',
      offer: 'Buy our recommended packages',
      back: 'Go back to your chosen package',
    },
    invite_page: {
      main_text_invite: [
        'Get 500 free points, equivalent to ',
        10,
        '/registration',
      ],
      invite_one: ['Invite 1 friend ', 'Get', '500 free points'],
      invite_ten: ['Invite 10 friends ', 'Get', '5,000 free points'],
      invite_100: ['Invite 100 friends ', 'Get', '50,000 free points'],
      sub_text_invite:
        'Just send a QR code or invite link to your friends to sign up with Botnoi Voice',
      link_invite: 'Invite Link ',
      noted: [
        'Note',
        ' You have invited 10 friends limit and you cannot invite more friends',
      ],
      copy_link: 'Copy Link',
      number_link: ['All Invitations', 'Invitations'],
      qr_maintext: 'QR Code to invite friends',
    },
    record_voice: {
      record_point: ['Points from recording', 'PT'],
      next: 'Skip',
      record_contain: ['Read', 'Reads', 'Times'],
      read_again: 'Read again',
      sent_audio: 'Submit audio file',
      play_audio: 'Play audio',
      err_redirect: {
        text_press_putMicrophoneBT:
          'Press the microphone to start reading text',
        can_use_on_Chrome:
          'Audio recording only supports chrome browser. We’re sorry for the inconvenience',
        wordOut: 'No more text to be displayed',
        err_type_text: 'No text in this category',
      },
      record_information: {
        recommend: 'Recording Instructions',
        text_right: [
          'Please avoid recording in disturbing noise environment.',
          'Use microphone to record for a better sound quality.',
        ],
        stepRecord: 'Recording Steps',
        pushMic: 'Press the microphone button',
        begidRecord: 'to start recording.',
        recordMethod: [
          'Read the the text box.',
          "A system will record the user's voice.",
          'When finish reading, press the microphone again to stop.',
          'Press "Play audio" button.',
          'If users want to listen to their own recorded voice',
          'or re-record the reading, press the "Read again" button.',
          'When satisfied with the recorded voice, press "Submit audio file" button.',
          'Then, it’s done, and start reading the next text.',
          'Users can change the category of texts or',
          'press skip to turn to the new text as needed.',
        ],
      },
    },
    coupon_code: {
      code_: 'Code',
      couponInput: 'Enter Code Here',
      access: 'Confirm',
      redirect: {
        incorrect: 'Code not found. Your code might be invalid or incorrect.',
        success: 'Code is successfully redeemed',
        alreade_use: 'Your code has been redeemed',
        expired: 'Your code has expired',
        notFillCoupon: 'Please enter your code',
      },
    },
    alert: {
      buy_points: 'Top-up complete',
      subscription: 'Package subscription successful',
      alert_success_point: {
        header: 'Payment successful',
        details: 'Received x points',
        ok: 'Studio',
        close: 'Close',
        getpoints_text: 'You received',
        point: 'PT',
        right: 'And granted the right to use',
        right2: 'Granted the right to use',
        package_noadds: 'Free No ads',
        package_unlimited: 'Unlimited',
        day: 'days',
        month: 'month',
        ps: 'If you need a tax invoice, please contact us at admin@botnoigroup.com. Requests for invoices can be made within 15 days from the date of purchase',
      },
      alert_success_package: {
        header: 'Payment successful',
        details: 'Successfully subscribed to No Ads membership.',
        ok: 'Studio',
        close: 'Close',
        right2: 'Granted the right to use',
        day: 'days',
        ps: 'If you need a tax invoice, please contact us at admin@botnoigroup.com. Requests for invoices can be made within 15 days from the date of purchase',
      },
      alert_error: {
        header: 'Payment failed',
        details:
          'Sorry, your payment was not successful. Please contact customer service to resolve the issue',
        ok: 'Contact customer service',
      },
    },
  },
];

const marketplace = [
  {
    selectVoiceover: 'Select Voice over',
    addVoiceover: 'Add Voice over',

    recommend: 'Recommended voice over',
    seeAll: 'See all voice artists',

    searchVoiceover: 'Search for voice over you want to add',
    searchVoiceover_result: 'Search for your added voiceover',

    search: 'Search',
    cancel: 'Cancel',

    style_: 'Style',
    delete_Voiceover: 'Delete Voiceover',
    play: 'Play',
    pause: 'Pause',
    touse: 'Tutorial',

    add_: 'add',
    remove_: 'remove',

    err_redirect: {
      notFound_result: 'No Result Found',
      pleaseAddVoiceover:
        'Please add a voice over to your studio. Click the button below.',
    },
    marketplace_alert: {
      alert_text: 'Confirm to remove the voice over from Studio',
      addOnCart: 'Voiceover has been added to your studio',
      removeOnCart: 'Voiceover has been removed from your studio',
      text: ['Do you want to remove', 'from the list?'],
      cancel: 'Cancel',
      access: 'Confirm',
    },
    floating_message: {},
    marketplace_search: {
      selectvoiceover: 'Select Your Voiceover',
      text_detail:
        'Botnoi Voice offers a variety of voice-over collections for you to choose.',
      search_text: 'Search the voice over here ',
      filter_: 'Filter',
      filterSearch: {
        access: 'Confirm',
        soundCategory_text: 'Category',
        soundStyle_text: 'Style',
        gender_text: 'Gender',
        language_text: 'Language',
        soundCategory: [
          'Popular',
          'Narrating',
          'News Reading',
          'Drama Voice Over',
          'Anime Voice Over',
          'Other accents',
          'General',
        ],
        soundStyle: [
          'News Reading',
          'Storytelling',
          'Advertising Spot',
          'Documentary',
          'Narrating',
          'Taletelling',
          'Teaching',
          'Character',
          'Anime',
          'Local',
          'Foreign Voice',
        ],
        voiceStyle: [
          'Cute',
          'Trustworthy',
          'Exciting',
          'Confident',
          'Clear',
          'Sweet',
          'Serious',
          'Mysterious',
          'Calm',
          'Soothing',
          'Warm',
          'Commanding',
          'Leading lady',
          'Leading man',
          'Villainous',
          'Playful',
          'Melodious',
          'Energetic',
          'Gentle and tender',
          'Regional accent',
          'Northern accent',
          'Elegant',
          'Northeastern accent',
          'Fun and lively',
          'Mellow',
        ],
        gender: ['Male', 'Female', 'Kid', 'Adult', 'Elderly'],
        language: ['Thai', 'English'],
      },
    },
    lasted_sound: {
      topic: 'Latest Added Voices',
      addSound: ['Add Voice Over', 'add'],
      removeSound: ['Remove Voice Over', 'remove'],
      play: 'Play',
      pause: 'Pause',
      sound: 'Sound',
    },
    category_sound: {
      topic: 'All Voice Over Lists',
      caregory: [
        'Voice Over Categories',
        [
          'All',
          'Popular',
          'Narrating',
          'News Reading',
          'Drama Voice Over',
          'Anime Voice Over',
          'Other accents',
          'General',
        ],
      ],
      result: 'Search Result',
      clearSearch: 'Clear Search History',
      result_num: ['Total', 'Voice Over Lists'],
      picture: 'Picture',
      name: 'Name',
      table: [
        'Gender',
        'Language',
        'Total Downloads',
        'Voice Style',
        'Add Voice',
        'Play Voice',
      ],
      numberWithCom: 'Times',
      style: 'Style',
      addCart_: ['Add Voice', 'add'],
      removeCart_: ['Remove Voice', 'remove'],
      personPlay: ['Play', 'Pause'],
      redirect: {
        notFoundResult: 'No Result Found',
      },
    },
    topten_sound: {
      topic: 'Top 10 Voice Over Options',
      addCart_: ['Add Voice', 'add'],
      removeCart_: ['Remove Voice', 'remove'],
      personPlay: ['Play', 'Pause'],
      numberWithCom: 'Time(s)',
    },
    studio_sound: {
      topic: 'Voice Over in Studio ',
      remove: 'Remove studio',
      selectAll: 'Select All',
      accessRemove: 'Removal Confirmed',
      delete: ['Delete Voice Over', 'remove'],
      personPlay: ['Play', 'Pause'],
    },
    add_cart: {
      header: 'Voice you want to add to studio',
      result_false: 'You have not added any voice to Studio',
      add_btn: ['Press button', ' to add voice'],
      result: ['Add', 'list(s)'],
      total: ['Total', 'Voice(s)'],
      saveSpeaker_: 'Save',
    },
  },
];

const api_tutorial = [
  {
    guide_header: 'Tutorial',
    ex_api: 'Sample for this API Testing',
    forDev_header: 'For Developer',
    copyDetail: 'You can copy and utilize this code',
    chang: 'Change',
    copy: 'Copy',
    text_exampleApi: 'API Testing',
    textOnbodySending: 'Hello',
    redirect: {
      copyComplete: 'Text Copied',
    },
  },
];

const share = [
  {
    title_nameFile: 'Name the Audio File',
    input_nameFile: 'File Name',
    title_imageFile: 'Upload Background Image',
    input_editImage: 'edit',
    input_editbackgroundImage: 'Edit Background Image',
    fileDownload: 'file_download',
    uploadImage: 'Upload Image',
    share_: 'Share',
    err_redirect: {
      imageType: 'Support File Types .jpg .jpeg .png onlyใ',
    },
  },
];

const upsell = {
  header: {
    text: 'Not enough points',
    sub: ['You need ', ' points to download audio'],
    text_noads: 'Free gift when buy points',
    sub_noads: ['Worthly! ', 'Buy point get No Ads'],
  },
  content: {
    btn: 'Buy',
    ...inputPoint,
    special_text: ['Hot deal!', '50% extra points'],
    free_gift: ['Free ', ' Month'],
    countdown: 'within',
    footer: ['More hot deals inside!', 'Click'],
  },
};

const addcart_alert = [
  {
    text_1: 'Do you want to leave this page?',
    text_2: 'You have not saved the downloaded audio in the voice studio',
    text_3:
      'Are you sure you want to leave this page? You have unsaved changes.',
    exit: 'Leave this page',
    exitSave: 'Save and leave this page.',
  },
];

const dialog = [
  {
    backButton: 'Press the OK button to return to the page',
    pay4point: ['You can buy more points', 'Add more points'],
    toPayment: 'Go to Top up page',
    warning:
      'If you leave this page, the work done will not be saved. We recommend keeping the created message to prevent loss of work.',
    invite4point: [
      'Invite friends to register for Botnoi voice to get free points',
      'Invite friends get free points',
    ],
    record4point: [
      'Record Voice for Free Points',
      'Record Voice for Free Points',
    ],
    btBelow: 'Click the button below',
    or: 'or',
    accept: 'OK',

    redirect: {
      err_1: 'Something went wrong',
      notEnoughPoint: 'Your point is insufficient',
      notEnoughCoin: ['Need', 'points more', 'equivalent to', 'USD'],
    },
    dialogPaid: {
      alert: 'This Codename does not exist in the system.',
      confirm: 'confirm',
      cancel: 'cancel',
      paidPayment: 'Payment',
      orderList: 'Order List',
      stepPaid: 'Payment method',
      qrScan: 'Scan QR Code',
      serviceFee: '(Operation fee + 0.3 USD)',
      concludePayment: 'Total Price',
      timelimit: 'The QR Code time will expire in',
      second: 'second',
      outofTimelimit: 'Your QR Code has expired.',
      saveqr: 'Save QR CODE',
      codename: 'Codename',
      warning:
        'Please do not close this page until the transaction is complete.',
      recommend: 'Reload the website if the points do not appear',
      mobile:
        'If using the website on a mobile phone, it is recommended to top up at least 1 USD to avoid problems with topping up.',
    },
  },
];

const report = {
  report_title: 'Report an issue',
  report_details:
    'Report issues, subscribing to packages, or purchasing points.',
  report_button: 'Contact support',
};

const audioPlan = [
  {
    title: 'Free',
    image: 'free',
    size: '100 MB',
    lists: ['Data Storage Capacity 100 MB'],
    price: {
      monthly: 'Current Plan',
      yearly: 'Current Plan',
    },
  },
  {
    title: 'Basic',
    image: 'basic',
    size: '1 GB',
    lists: ['Data Storage Capacity 1 GB', 'Earn 250 Points / Month'],
    price: {
      monthly: '50 USD / Month',
      yearly: '500 USD / Year',
    },
  },
  {
    title: 'Standard',
    image: 'standard',
    size: '10 GB',
    lists: ['Data Storage Capacity 10 GB', 'Earn  1,000 Points / Month'],
    price: {
      monthly: '150 USD / Month',
      yearly: '1,500 USD / Year',
    },
  },
  {
    title: 'Premium',
    image: 'premium',
    size: '100 GB',
    lists: ['Data Storage Capacity 100 GB', 'Earnบ 4,000 Points / Month'],
    price: {
      monthly: '500 USD / Month',
      yearly: '5,000 USD / Year',
    },
  },
];

const bottomMenu = [
  {
    warn: 'Please select voice over option before generating voice audio',
    setSound: 'Sound Setting',
    setLang: 'Language',
    _save: 'Save',
    selectVoiceover: 'Select Voice Over',
    genSound: 'Generate',
    saveSet: 'Save Setting',
    editWringreading: 'Edit Mispronounced Word',
    editWrongWord: 'Edit Misspelled Word',
    selectedVoiceover: 'Select Voice Over',
    editSpeed: 'Adjust Speed',
    editVolumn: 'Adjust Volume',
    historyEdit: 'Edit History',
    writing: 'Spelling',
    reading: 'Pronunciation',
    _writing: 'Enter Spelling',
    _reading: 'Enter Your Pronunciation',
    addAnotherword: 'Add More Words',
    cancel: 'Cancel',
    save: 'Save',
    redirect: {
      emptyHistory: 'No Edit History Found',
    },
    alertNotfound: ['Not found ', ' in message'],
    mainLang: 'Main Language',
    addonsLang: 'Additional Language',
  },
];

const dialogconfirm = [
  {
    topic: 'How would you like to save your file as?',
    fileExtension: 'File Type',
    confirmDownload: 'Confirm Download',
    paidPoint: 'Total Points You Spent',
    price: 'Total Price',
    note: ['Note', 'A background music will be removed once you downloaded'],
    cancel: 'Cancel',
    confirm: 'Download',
    redirect: {
      turnOnbtDownloadAll:
        'Activate this button to download the desired multiple audio files. Our system will merge them all into one audio file.',
      turnOnbtSaveFile:
        'Activate this button to store downloaded audio files in the sound library.',
    },
    storage: {
      text: 'Save to storage',
      dropdown: ["Don't save", 'save'],
    },
  },
];

const addworddialog = [
  {
    addWrongWord: 'Add More Mispronounced Words',
    writing_ex: ['ตัวอย่างคำเขียน', 'อูเบอร์'],
    reading_ex: ['ตัวอย่างคำอ่าน', 'อู-เบ้อ'],
    writing: 'Spelling',
    reading: 'Pronunciation',
    typeWrite: 'Enter Spelling',
    typeRead: 'Enter Your Pronunciation',
    typeReaded: 'Enter Your Pronunciation',
    addAnother: 'Add More Words',
    save: 'Save',
    cancel: 'Cancel',
  },
];

const audio_download = [
  {
    confirmDownload: 'Confirm Download',
    cancel: 'Cancel',
    accept: 'Download',
    success: 'Success',
    downloadAll: 'Download all files',
    downloadSuccess: 'Download complete',
    file_: 'File',
  },
];

const sales = {
  topic: 'Sales',
  salesname: 'Loading . . .',
  codeName: 'Your codename',
  copy_: 'Copy',
  titleIncome: 'Monthly Earnings',
  bath: 'USD',
  totalIncome: 'Total Earnings',
  withdraw: 'Withdraw',
  customerList: ['Customers list', 'in month'],
  customerTotal: ['Total', 'Users'],
  balanceDate: 'Balance between',
  currency: 'USD',
  withdrawn_note:
    'You will receive money within 10 - 15 days in the next month.',
  viewPanel: {
    list: 'List',
    total: 'Total',
  },
  successCopy: 'Copied successfully',
  tooltips: {
    sales:
      'This program benefits users who perform sales by referring the Botnoi Voice platform to other users. If sold, you will receive a share of the agreed-upon sales.',
    balance: 'Your monthly earnings will be cut off at the end of each month.',
    codename:
      'A referral code is a code to verify that you are a sales referral to other users. Those users from your contacts will have to enter your codename in the "Referral Code." Once it\'s redeemed, you will get commission from the sales referrals.',
    totalbalance:
      'You can request to withdraw your total earnings once your balance reaches 30 USD. Your payment will be issued, and it will take 5-7 business days to reflect in your bank account.',
  },

  table: {
    header: ['Order', 'Username', 'Sales Amount', 'Commission'],
  },
  warning: {
    incomeMonth: 'Current balance earned within this month',
    incomeWithdraw:
      'Current balance from the total earnings that you can withdraw',
  },
  redirect: {
    copyComplete: 'Text Copied',
  },
};

const _auth = {
  redirect: {
    pleaseLogin: 'Please sign-in again',
    notfoundPayment:
      'Your payment was not detected. Please make sure you have successfully completed the transaction.',
  },
};

const dialogMessageObj = {
  successAddPronunciation: 'Add pronunciation!',

  permissionCookie:
    'Our website uses cookies to improve your website experience.',
  readDetail: 'Learn more here',
  acceptCookie: 'Accept All',
  acceptDeletes: 'Confirm deleting data',
  confirmDelete: 'You want to delete',
  checkList: 'List yes or no?',
  cancel_: 'Cancel',
  accept_: 'Confirm',
  agree_: 'OK',
  code_: 'code',
  file_: 'file',
  finish_: 'Finish',
  addcode: 'add code',
  addword: 'add word',
  save_: 'Save',
  successfully: 'Enter the code successfully',
  notEnoughpoint: 'Your point is insufficient. Please add points',
  needMorePoint: 'Do you want to buy more points?',
  acceptDownload: 'Confirm audio download',
  acceptPayPoint: 'Confirm Pay Point 35 PT',
  successfulDownload: 'Successfully downloaded audio file',
  downloadAllfile: 'Download all files',
  finishDownloaded: 'Finish downloading',
  successfulPayment: 'Successful payment',
  successfulDownloadSound: 'Successfully downloaded sound file',
  ownerPoint: 'Your point has',
  returnToText2Speech: 'OK',
  regidter: 'Register now!',
  forOffer: 'for special offers and discounts',
  pleasefill: 'Please fill in',
  sentdata: 'Submit',
  copyComplete: 'Link copied successfully',
  topicEditword: 'Correct misspelled words',
  writing: 'Written',
  reading: 'Pronunciation',
  writing_: 'Type writing',
  reading_: 'Type words to read and spell',
  successfullySent: 'Sent sent successfully',
  callbackLater:
    'We will contact you as soon as possible. Thank you for your interest',
  placeholderList: [
    'Fullname',
    'Organization Name',
    'Phone Number',
    'Email',
    'Description',
  ],
  alertMessage: {
    notFoundCode:
      'This code was not found. The code may not work anymore or the code you added is invalid.',
    canUseCode: 'Your code can be used.',
    usedCode: 'Your code has already been used.',
    expireCode: 'Your code has expired.',
    placeCode: 'Please enter your code',
  },
};

const dialogService = {
  agree_: 'OK',
  problemTryagain: 'An error occurred. Please try again',
  recordNotsup:
    'The recording system is not supported by the operating system.',
  welcomeword: 'Welcome to Botnoi Voice',
  receive: 'You have received 500 PT',
  usedCode: 'You have already used the code',
  inviteCodeerr: 'A friend code can only be used once per account.',
  codeerr: 'Code cannot be executed',
  inviteCodeself: 'You cannot use this code to invite yourself.',
  copy_: 'Link successfully copied',
};

const firebaseAuth: TFirebaseAuth = {
  signin_by: 'Sign in by',
  or: 'OR',
  sign_in: 'Sign in',
  no_account: "Don't have an account?",
  exist_account: 'Already have an account?',
  sign_up: 'Sign up',
  email: 'Email',
  password: 'Password',
  confirm_password: 'Confirm password',
  sign_up_popup: {
    header: 'Account created successfully',
    text: 'Please check your email. and verify the account within 7 days',
    send_at: 'Send to ',
    accept: 'I understand',
  },
  verify_popup: {
    header: 'Email verified successfully',
    text: `Let's get started`,
    accept: 'Go to login page',
  },
  options: {
    remember: 'Remember me',
    forget_password: 'Forgot Password',
    text: 'A password reset link has been sent to your email. Please check the email.',
    reset_password: 'Reset Password',
    reset_password_complete: 'Password reset completed.',
    save: 'บันทึก',
  },
};

const campaign = {
  description1:
    'BOTNOI Voice is an AI that can convert text to voice. Suitable for teachers who will use it to make teaching materials. The BOTNOI team sees the importance of creating ',
  description2:
    'New teaching media Therefore, this project was established for teachers to use this AI to make teaching materials. ',
  rules: 'Participation Rules',
  seemoreWorkshop: 'You can see sample works at',
  textli: [
    'Start point when applying = 100 points',
    'When you join the group and fill out the information Every day, the system will check, if the Point is less than 500 points, the system will automatically add +10,000 points',
    'Teachers who already have an account and have more than 500 points, when the point is less than 500 pts, the system will top up',
    'When making a video clip on Social, please add #BotnoiVoice #teacherXbotnoivoice',
    'Whose work is interesting, win a chance to be a partner with Noi Bot!',
  ],
  conditionTopic: 'Conditions for Participation',
  warning:
    'Credit given for the creation of educational materials only. If found to be used for other things We reserve the right not to give additional credit',
  contact: [
    'If a teacher or teacher Anyone interested can click this link. to enter the Open Chat group or scan the Qr Code below',
    'Join Link',
  ],
};

const soundTest = {
  topic1: 'Try listening to audio from text',
  topic2: 'AI voice synthesis developed by Thai people',
  selectVoiceOver: 'Select voice over',
  typeSomething: 'Type text',
  errAlert: 'Unable to play sound. Please try again.',
  listening: 'Listen to the sound',
};

const popupObj = [
  {
    title: 'Your Withdrawal Request Was Successfully Sent',
    detail:
      'The system will transfer money to you within 14 business days from the end of the month.',
    buttonInfo: 'Close this window',
  },
  {
    title: 'Request Processing',
    detail: 'Your request has been received and is being processed',
    buttonInfo: 'Close this window',
  },
  {
    header: 'Do you want to submit a withdrawal request?',
    details: '',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
];

const agreement = {
  callback: 'Go back to sound creation page',
  agreeCondiotion: 'Terms and Conditions of Use',
  cancel_: 'Cancel',
  accept_: 'OK',
  title_delete_fb: 'Delete account',
  delete_fb: 'Confirm account deletion',
  confirm_dialog: {
    title: 'Delete Account',
    label: `Enter "I confirm deleting this account".`,
    btn: 'Confirm',
    confirm_text: 'I confirm deleting this account',
  },
  agreementAccept: 'I accept the terms and conditions.',
  description: {
    description1:
      'Accessing this website As well as opening various pages contained in this website, website users. (“User”) agrees and agrees to comply with the policies of Botnoi Group (“Bobotnoi Group”), applicable laws and the terms and conditions of use of the website set forth in this Agreement as well. Generally defined and specifically defined in any part of this website ("Terms and Conditions of Use"), the user acknowledges and agrees that these terms and conditions of use are are subject to change without prior notice',
    description2:
      'However, any changes Any changes relating to the Terms and Conditions of Use will be published on this website, and when the user accesses this website after such changes, the user shall be deemed to have accepted all terms and conditions of use in accordance with. has been changed, so users are advised to always follow the terms and conditions of use of this website set forth herein.',
    description3:
      'However, if you do not agree or wish to refuse to be bound by any of the terms and conditions of use, please stop visiting and using this website.',
  },
  titlewithDescrip: [
    {
      title: '1. Use of the Website and Intellectual Property',
      description: [
        '1.1 All information contained in this website including but not limited to picture message Trademarks, graphics, sound, screen design, applications, user interface design, data in any form. Any software programs contained in this website, including all materials downloaded by users from this website (hereinafter collectively referred to as "Content"), are owned by the BOTLIER GROUP or its affiliates. grant a license to Little Bot Group whose content is protected by intellectual property and/or other proprietary rights. under the laws of Thailand and/or the laws of other countries in any form. and whether it has been registered or not',
        'By the way, the use of trade names trademark Service marks and other marks of Botnoi Group including any intellectual property to use any material appearing on this website for any purpose Users must obtain prior written consent from the bot group before proceeding.',
        "1.2 All trade names, product names, trademarks service marks and other marks as well as any other intellectual property that appears on this website other than Botnoi's intellectual property. The Group which has been compiled or made available as a component of this website is for the sole purpose of beautifying the appearance of the website by Botnoi Group, as the operator of this website, not intended to be take any action which infringes any commercial or intellectual property rights of any person unless otherwise stated on this website",
      ],
    },
    {
      title: '2.Acceptance of these terms and conditions',
      description: [
        '2.1. All Users must use the Service in accordance with the terms specified in the Terms and Conditions. This edition, the user will not be able to use the service unless the user has agreed to the terms and conditions. this edition',
        '2.2. Users who are minors may use the Service only with the prior consent of their parents or legal representatives. If such users use the Service on behalf of or for the purposes of any business entity, it shall be deemed that such business entity has agreed to these Terms and Conditions in advance.',
        '2.3. If there are terms and conditions Any additional terms and conditions relating to the Service, the User shall comply with such additional terms and conditions as well as the Terms and Conditions. in using this edition',
      ],
    },
    {
      title: '3. Disclaimer and Limitation of Liability',
      description: [
        '3.1 This website is a website for the use of Speech Synthetic. to use in a way that damages, defames, infringes intellectual copyright Or violate any law if the user uses the content on the website for illegal use. violation of privacy or violation of intellectual property The user is responsible for all legal consequences. solely',
        '3.2 Botnoi Group reserves the right to consider not allowing users to use this website and reserves the right to change or suspend the website service in part or in whole and at any time. to the user without prior notice or stating the reason for doing so',
        "3.3 Botnoy Group does not warrant that all advertisements on this website (if any) are accurate, complete and free from any defects. Botnoy Group is only an intermediary in transmitting advertising data. and is not an agent, partner or legal relationship in any way with the owner of the advertisements displayed on this website. can't check Or know the source and/or details of all advertisements that appear on this website. If such advertisements cause loss or damage to the user. Botnoi Group disclaims all liability and legal obligations.",
        '3.4 Other than those set forth in these Terms and Conditions of Use, Botnoi Group, its directors, managers, executives, employees, employees, agents or consultants of Botnoi Group will not be held liable for mistakes. or any defects of the website or from the information content appearing on the website as well as not being liable for the consequences of any omissions in connection with this website. Whether caused by contract, tort, negligence or any other cause that may occur Although a small group of bots have been informed that such damage may occur.',
      ],
    },
    {
      title:
        '4. Compensation for damages If a user violates the terms of use of the service as specified and causes damage in any way to the bot group. Via Bot Noi Group We reserve the right to claim damages from that user.',
    },
    {
      title:
        '5.External Service Provider Service This may contain content. or any other service provided or provided by an external service provider. In this regard, such third party service providers will be solely responsible for the Content. In addition, such Content or Services may be subject to terms of use or other terms and conditions which the third party provider has imposed for such Content and Services.',
    },
    {
      title:
        "6. Website Security Policy Botnoi Group has chosen to use technology. Security measures for transactions on the internet network To protect user data during transmission through communication networks. or from data theft by any unauthorized person or network connected to the Bot Group's network, such as Firewall and Secured Socket Layer (SSL) encryption, etc.",
    },
    {
      title:
        '7. Governing Law Terms and conditions of use of this website are governed by the laws of Thailand',
    },
  ],
};

const blacklist = {
  title1: 'Your account is on the Blacklist',
  title2: 'If in doubt please contact us',
};

const longword = {
  mainSelection: 'Exceeded 1000 character set',
  subSelection:
    'Please divide the text you want to cover for the next sentence.',
  mainLongword: 'Typed a 1000-character word.',
  subLongword:
    'Sound generating time is increased when there are too many characters',
};

const audio = {
  removeAudio: {
    acceptDeleted: 'Confirm audio file deletion',
    deleteSeleted: 'Do you want to delete the selected item?',
    confirm: 'Yes or no?',
    cancel_: 'Cancel',
    accept_: 'Confirm',
    count: 'items',
  },
  upgradeAudio: {
    planPackage: {
      package: 'Audio Library Repository Package',
      detail: 'Discount up to 16.67% only for annual package purchase!',
    },
  },
};

const storage = {
  studio: 'My Audio Library',
  storageText: 'Audio Storage',

  usede: 'Already used',

  from: 'of',
  allsoundFile: 'Audio files',
  searchSound: 'Searching...',

  page_: 'Page',
  text_: 'View text',
  upload: 'Upload',
  seletedPage: 'Select all (pages ',
  deleteSelected: 'Clear Selection',
  downloadSoundfile: 'Download sound file',
  download_: 'Download',
  deleteSoundfile: 'Delete the sound file',
  delete_: 'delete',
  removeAll: 'Remove all',
  downloading: 'Uploading file',
  sucessfulDownload: 'File uploaded successfully',
  copycomplete: 'Link successfully copied',
  copytoclipboard: 'Text successfully copied to clipboard',
  successfulDownloadsound: 'Sound downloaded successfully',
  successfulDeletesound: 'Successfully deleted audio file',
  successdeleteSoundfile: 'Soundfile successfully deleted',
  successdeleteAllsoundfile: 'Successfully deleted all sound files',
  tooltip: ['Copy to clipboard', 'Download', 'Copy link', 'Share', 'Remove'],
};

const workspace = {
  projectAuto: 'Project',
  createProject: 'Create new project',
  insertImage: 'Change image',
  projectName: 'Project name',
  placeholder: 'New project',
  type: 'Type',
  createBook: 'Book',
  createConversation: 'Conversation',
  cancel: 'Cancel',
  submit: 'Submit',
  project: 'My projects',
  editProject: 'Edit project',
  lastChange: {
    update: 'Last updated',
    ago: 'ago',
  },
  recentProject: 'Recent project',
  changeName: 'Edit name',
  changeImage: 'Change image',
  deleteProject: 'Delete project',
  alert: {
    size: 'File size exceed 10 Mb',
    type: 'File type not supported',
    img: 'Please insert an image',
    max: 'Project storage full',
    duplicate: 'Project name already existed',
    sameName: 'Please enter new project name',
    blank: 'Please enter project name',
  },
  deleteAlert: 'Are you sure you want to delete this project?',
  confirm: 'confirm',
  timeUnit: {
    hour: 'hours ',
    day: 'days ',
    week: 'weeks ',
    month: 'months ',
    year: 'years ',
  },
  alertDialog: [
    {
      header: 'The project has reached its maximum limit',
      details: 'Do you want to upgrade your package to create more projects ?',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    {
      header_edit: 'Edit project name',
      header_create: 'Name the project',
      input_text: 'Enter a new project name',
      alert: 'Name cannot exceed 25 characters',
      cancel: 'Cancel',
      confirm: 'Save',
    },
    {
      header: 'Edit project image',
      insertImage: 'Change image',
      cancel: 'Cancel',
      confirm: 'Save',
      sizeExceed: 'Image size can not exceed 10 MB',
      invalidType: 'File type not supported',
    },
    {
      header: 'Delete project',
      details:
        "You won't be able to use this project again. Are you sure you want to delete this project?",
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  ],
};

const subscription = {
  title: 'Membership',
  sub_title: 'Unlock your limits with the add-on package at an amazing price.',
  currency: currency,
  month: 'month',
  year: 'year',
  character: 'characters',
  time: 'time',
  free_price: 'Trial',
  free_try: 'Try for free',
  already_try: 'Already used',
  compensate_price: 'Free for 1 year',
  // special: 'Special! Discount until December 31, 2023.',
  special: ['Special! Discount until', ''],
  discount_box: ['', '% Off'],
  expire_at: 'Expired on',
  remaining_days: ['Only ', ' days left'],
  renew: 'Renew',
  faq_title: 'FAQ',
  faq: [
    {
      question: 'Can I try Botnoi voice before paying?',
      answer: 'Yes, you can.',
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We accept debit, credit and PromptPay payments.',
    },
    {
      question: 'Can I cancel my add-on anytime?',
      answer:
        'Yes, you can cancel your add-on at any time. The cancellation will be canceled in the next billing cycle. Your Add-on will be downgraded to a non-Add-on.',
    },
    {
      question: 'Can I have a tax invoice?',
      answer:
        'For customers who need a full tax invoice. You can request and attach proof of payment to the email. admin@botnoigroup.com',
    },
  ],
  discount: {
    title: '30% Off!',
    content: 'Offer until August 31, 2566',
  },
  yearly: [
    '990 USD/Year',
    '4,990 USD/Year',
    '9,990 USD/Year',
    '100,000 USD/Year',
  ],
  ads: {
    title: 'Package',
    for: 'For Enterprise',
    info: 'For advanced security and more flexible controls, the Enterprise plan helps you scale design processes company-wide.',
  },
  upgrade: 'Upgrade',
  downgrade: 'Downgrade',
  more: 'See more',
  cancel: 'Cancel Package',
  current: 'Current Package',
  contact: 'contact us',
  toggle_text: ['Daily', 'Monthly', 'Yearly'],
  discount_text: 'Discount',
  mock_text: {
    monthly_point: {
      number: '0',
      text: 'Monthly points',
      type: 'monthly',
    },
    text_limit: {
      number: '0',
      text: 'Characters generating/times',
      type: 'limit',
    },
    play_quota: {
      number: '0',
      text: 'Characters generating/day',
      type: 'play',
    },
    storage: {
      number: '0',
      text: 'MB Storage size',
      type: 'storage',
    },
    point_discount_percent: {
      number: '0',
      text: 'Points discount',
      type: 'discount',
    },
    no_storage: {
      text: 'Unlimited audio downloads',
      type: 'monthly',
    },
    only_platform: {
      number: 'Audio creation',
      text: ' is available exclusively on the platform',
      type: 'platform',
    },
  },
  change_package: {
    title: 'Change Package',
    text: 'Before changing the package, it is necessary to cancel the old package. Want to cancel it?',
    yes: 'OK',
    no: 'Cancel',
    complete: 'Changed the package successfully',
  },
  tier: {
    point_discount: 'Point discount',
    buy_discount: 'Buy points at a',
    discount: '',
    discount_suffix: 'discount',
    noads: 'Ad-free',
    limit_text: '2,000 characters of audio',
    storage_front: '',
    storage_back: 'x increase in audio file storage',
    limit: 'Create voice for',
    sign_up: 'Try it',
    disable_text: 'Already a Add-on',
  },
};
const importexport = {
  importFile: 'Import File',
  supportFile: 'File supported type .csv',
  templateCSV: 'Download template.csv',
  templateXLSX: 'Download template.xlsx',
  sampleFile: 'File sample',
  cancel: 'Cancel',
  selectFile: 'Select File',
  uploadSuccess: 'Upload Success',
  confirm: 'Confirm',
  uploadFailed: 'Upload Failed',
  selectAgain: 'Select file again',
  exportFile: 'Export File',
  selectType: 'Select file type',
  exportConfirm: 'Export',
};

const leaveAlert = {
  confirmAlert: 'Please confirm',
  leaving: 'You are navigating away from this page.',
  askSave: 'Do you want to save before exit ?',
  cancel: 'Cancel',
  confirm: 'Save and Exit',
  free: {
    header: 'You are navigating away from this page',
    details_1:
      'Because your current package is Free, your work cannot be saved. Are you sure you want to leave this page?',
    cancel: 'Cancel',
    confirm: 'Exit',
  },
};

const userObj = {
  list: ['Profile', 'My packages'],
  profile: {
    title: 'Contact Information',
    username: 'Username',
    email: 'Email',

    uid: 'UID',
    copy: 'Copy',
    done: 'Successfully copied',
    upgrade: {
      title: 'Audio Storage',
    },
    speaker: {
      header: ['pulse', 'star'],
      header_text: ['AI Voice', 'Review'],
      toggle: 0,
      noSpeaker: 'AI voice generation service coming soon',
    },
  },
  subscription: {
    title: 'My packages',
    package: 'Membership',
    price: 'Price',
    status: 'Expire',
    expire: 'Auto-renewal',
    debit: ['Disabled', 'Auto-debit'],
    member: 'Add-on',
    general_member: 'General Add-on',
    free: 'Free',
    upgrade: 'Upgrade',
    cancel: 'Cancel membership',
    currency: ' USD',
    period: {
      0: 'day',
      1: 'month',
      12: 'year',
    },
    date: 'Date',
    time: {
      expire: '',
      renew: '',
    },
    warning: {
      title: 'Recommend',
      content:
        "The system will automatically deduct funds for subscription renewal. If you do not wish to renew your subscription, please click the 'Cancel membership' button below.",
    },
    cancel_package: {
      title: 'Cancel membership',
      content: [
        'You will be able to use the membership rights until ',
        ' Do you want to cancel this membership?',
      ],
      btn: 'Cancel membership',
    },
    box2: {
      title: 'Privilege Details',
      advantages: {
        daily_point: '<b>Free {x} </b>points/day',
        monthly_point: '<b>Free {x} </b>points/month',
        play_quota: 'Play quota <b> {x} </b> characters/day',
        USD_per_point: 'Points rate <b> {x} </b> USD/points',
        paper: 'Suitable for A4 ≈ 250 pages',
        clip: '30-second clips ≈ 1,600 clips',
        text_limit: 'Typing <b> {x} </b> characters/box',
        workspace: 'Limited to <b> {x} </b> projects',
        text: 'Unlimited',
        download: '<b> {x} </b> audio downloads',
      },
    },
    cancel_status: 'Membership canceled successfully',
  },
};

const newsObj = {
  title: 'Announce',
  ask: ['Do not show again in ', ' days'],
  btn: 'View details',
};

const historyAlert = {
  header: 'Cancel editing pronunciation',
  askDelete: 'Do you want to remove the pronunciation editing?',
  cancel: 'Cancel',
  confirm: 'Delete',
};

const quoteObj = {
  title: 'Price',
  ...usagePriceOnLandingPage,
  box3: {
    title: ['Special price?'],
    btn: 'Contact Us',
  },
};

const selectVoiceDialog = {
  header: 'Select voice',
  allVoice: 'All Voice',
  favorite: 'Favorite',
  lang: 'Language',
  style: 'Style',
  categories: 'Category',
  gender: 'Gender/Age',
  all: 'All',
  popular: 'Popular',
  new: 'New',
  selectAll: 'Select all',
  useVoice: 'Use voice',
  using: 'Using',
  confirm: 'Confirm',
  searchResult: 'Search results',
  resultAll: 'Total',
  resultList: 'speakers',
  noResult: 'No search results found',
  try: 'Try using a different name',
  alert: 'Please select speaker',
  clear: 'Clear',
  addFav: 'Add to favorites',
  removeFav: 'Added to favorites',
  tooltip: {
    playSound: 'Listen',
    useVoice: 'Use this voice',
    addFav: 'Add to favorites',
    removeFav: 'Remove from favorites',
    next: 'Next',
    previous: 'Previous',
    filter: 'Search in detail',
  },
  freeVoice: 'Free',
  favVoice: 'Favorite',
  other: '+ others',
  other_lang: 'Available languages',
  freeTag: 'Free',
};

const patchNoteObj = {
  title: 'Good News',
  text: [
    'Botnoi Voice is now offering free voice creation service.',
    'All existing users will receive a special offer to use the Basic Package for free for 1 year. They will also receive a discount on point purchases. (This special offer does not include 5,000 bonus points / month)',
    'You can view the details and benefits of each package here.',
  ],
  checkbox: 'Never show it again',
};

const dialogPaid = {
  title: 'Payment',
  order: 'Order List',
  sales: {
    code: 'Code',
    info: 'Enter the code from various activities. to get more points (Optional)',
    warning: "This code doesn't exist",
    confirm: 'Confirm',
    valid: 'This code is valid',
    inValid: "This code doesn't exist",
    sellerStatus: 'seller code',
  },
  metholdTitle: 'Select Payment Method',
  method: [
    {
      icon: 'qr_code',
      text: 'Scan QR Code',
      type: 'promptpay',
      fee: 'Free',
    },
    {
      icon: 'credit_card',
      text: 'Credit/Debit Card',
      type: 'card',
      fee: 'processing fee',
    },
  ],
  auto_credit: 'The system will automatically deduct the payment every month',
  fee: 'Operation Fee',
  codePoint: 'Use code to earn extra points',
  totalPoint: 'Total point',
  total: 'Total payment',
  currency: currency,
  point: 'PTs',
  period: {
    0: 'day',
    1: 'month',
    12: 'year',
  },
  cancel: 'Cancel',
  confirm: 'Purchase',
  step2: {
    title: 'Scan QR code with Mobile Banking',
    info: 'Please keep this window open until the system Show Payment Success window.',
    cancel: 'Cancel',
  },
  free_gift: ['Free ', ' month'],
  purchaseAllPoints: 'Purchase all points',
  productCost: 'Product cost',
  shortTotalPoint: 'Total point',
  removeCode: 'Remove code',
  hotPromotion: 'Hottest Promotion',
  hotPromotionDescription: 'Get an additional 30% points, click now',
  hotPromotionPrice: 'Price of the hottest promotion',
};
const marketplace_v2_Obj = {
  header: 'Select voice',
  allVoice: 'All Voice',
  favorite: 'Favorite',
  lang: 'Language',
  style: 'Style',
  categories: 'Category',
  gender: 'Gender',
  all: 'All',
  popular: 'Popular',
  new: 'New',
  selectAll: 'Select all',
  useVoice: 'Use voice',
  using: 'Using',
  confirm: 'Confirm',
  searchResult: 'Search results',
  resultAll: 'Total',
  resultList: 'speakers',
  noResult: 'No search results found',
  try: 'Try using a different name',
  alert: 'Please select speaker',
  clear: 'Clear',
};

const quotaDialog = {
  header: 'Play quota limit reached',
  detail:
    'Play quota has reached its limit. You can download sounds to reclaim your quota, or upgrade to a higher package for more quota. Alternatively, wait for 24 hours for a reset',
  understand: 'Understand',
  upgrade: 'Upgrade',
};

const maintenance = {
  title: 'We are currently updating our website',
  sub: 'Sorry for the inconvenience. Our website is currently undergoing maintenance from 09:00 - 12:00',
  footer: 'Thank you for using the service',
};

const landingPageV3 = {
  hero: {
    header: 'WELCOME TO BOTNOI VOICE',
    header_1: 'Enhance your ',
    header_2: 'Convert text',
    header_3: 'to speech',
    header_4: 'with ',
    header_5: 'BOTNOI',
    description:
      'Easily convert text into realistic speech. More than 10+ languages to chooses, helping your work smoothly, whether it be voice over, dubbing, teaching media, reading news, presentation slides, podcasts, reading novels, finishing work easily, can be done anywhere.',
    detail: '3 simple steps',
    sub_detail: 'Choose your language.',
    sub_detail_1: 'Choose your voice tone - Male | Female',
    sub_detail_2: 'Type your Text in the box - HIT GENERATE',
    button: "Let's try free",
    ex_lang: 'Sound sample : ',
    visit: 'Website user count',
    genvoice: 'Generate Voice',
    try: 'Try Our AI Voices',
  },
  headerlanding: {
    headers: 'Botnoi Voice',
    subtitle: "Thailand's Leading AI Voice",
    detail:
      "Complete tasks swiftly, from creating slide clips to reading news, trusted by Thailand's leading companies.",
    button: 'Use for Free',
    visit: 'Website user count',
    genvoice: 'Generate Voice',
    downloadCount: '2 Free Downloads Remaining Today',
    limitdownlaod: 'Daily Free Download Limit Reached',
    point: 'Receive 100 Points for Free',
    newuser: 'For New Users',
    buttondownload: 'Sign Up for Free',
  },
  partner: {
    header: 'Trusted by 1.5 Million users across the world',
    header_2: 'TRUSTED BY INDIVIDUALS AND COMPANIES IN ALL INDUSTRIES',
    header_card: 'Average number of users',
    header_card2: 'Total Generated',
    detail_card: '120,000 Users/Month',
    detail_card2: '15M+ Downloads',
    btn: 'Become our partner',
  },
  createSound: {
    header: 'Experiment with creating a voice in your own.',
    tabs: ['Content', 'Teaching', 'Novel', 'Podcast'],
    detail: 'Experience Voice Creation.',
    placeholder: 'Enter text here.',
  },
  customer: {
    text: 'We have gained trust from several organizations that use our platform',
  },
  news: {
    header: 'Activities and news',
  },
  result: {
    header: 'Create Real Results',
    subtitle:
      'High-Quality Outputs from Using Botnoi Voice for News Stories, Educational Content, and Entertainment',
    card1: 'Use Botnoi Voice to Create TikTok Videos',
    card1_name: 'bosebosh',
    card2: 'Use Botnoi Voice to Create Online Educational Media',
    card2_name: '@KruApiwat',
    card3: 'Use Botnoi Voice to Create TikTok Videos',
    card3_name: 'fictionfive11',
    button: 'View More Details',
  },
  compare: {
    pack: {
      basic: {
        name: 'Basic',
        price: '99',
        unit: 'USD/month',
        detail_1: '1 A4 text can be converted to ≈ 3 pages',
        detail_2: '30-second clips ≈ 20 clips',
        detail_list: {
          row_1_num: 'Free 5,000',
          row_1_text: 'points/month',
          row_2_text_1: 'Play quota',
          row_2_num: '1,000 ',
          row_2_text_2: 'characters/day',
          row_3_text_1: 'Points rate',
          row_3_num: '0.02',
          row_3_text_2: 'USD/points',
          row_4_text_1: 'Limited to',
          row_4_num: '2',
          row_4_text_2: 'projects',
          row_5_text_1: 'Typing',
          row_5_num: '1,000',
          row_5_text_2: 'characters/box',
        },
      },
      advance: {
        name: 'Advance',
        price: '199',
        unit: 'USD/month',
        detail_1: '1 A4 text can be converted to ≈ 12 pages',
        detail_2: '30-second clips ≈ 80 clips',
        detail_list: {
          row_1_num: 'Free 20,000',
          row_1_text: 'points/month',
          row_2_text_1: 'Play quota',
          row_2_num: '4,000 ',
          row_2_text_2: 'characters/day',
          row_3_text_1: 'Points rate',
          row_3_num: '0.018',
          row_3_text_2: 'USD/points',
          row_4_text_1: 'Limited to',
          row_4_num: '3',
          row_4_text_2: 'projects',
          row_5_text_1: 'Typing',
          row_5_num: '1,200',
          row_5_text_2: 'characters/box',
        },
      },
      pro: {
        name: 'Pro',
        price: '499',
        unit: 'USD/month',
        detail_1: '1 A4 text can be converted to ≈ 37 pages',
        detail_2: '30-second clips ≈ 240 clips',
        detail_list: {
          row_1_num: 'Free 60,000',
          row_1_text: 'points/month',
          row_2_text_1: 'Play quota',
          row_2_num: '10,000 ',
          row_2_text_2: 'characters/day',
          row_3_text_1: 'Points rate',
          row_3_num: '0.016',
          row_3_text_2: 'USD/points',
          row_4_text_1: 'Limited to',
          row_4_num: '5',
          row_4_text_2: 'projects',
          row_5_text_1: 'Typing',
          row_5_num: '1,500',
          row_5_text_2: 'characters/box',
        },
      },
    },
    card_header: 'Get more, pay less',
    card_detail:
      'There are various packages available for purchase, whether for temporary use, regular use, or unlimited use.',
    card_btn: ['Buy now, starting at only ', 99],
  },
  step: {
    header_1: 'Easy to use, ',
    header_2: 'just a 3 steps',
    card_1: 'Type text into the box',
    card_1_input: 'Type text to generate sound',
    card_2: 'Choose language - Select voice.',
    card_2_select_1: 'Thai',
    card_2_select_2: 'Select Voice',
    card_3: 'Generate sound and download',
    card_3_text_1: '20 Point',
    card_3_text_2: '≈ 0.028 USD',
    card_3_button: 'Download',
    card_3_header_lang: 'There are voices available in up to 10 languages',
    card_3_sub_lang:
      'Includes Thai and English voiceovers, along with many other neighboring languages, offering a selection of up to 10 languages in total',
    btn: 'Get started',
  },
  feature: {
    header: 'Features and Updates',
    card_2_header: 'Create and save work using',
    card_2_sub: 'Studio',
    card_2_btn: 'Create your project',
    card_1_name: 'Work faster with a system',
    card_1_highlight: 'Edit Misreading',
  },
  card_list: {
    text_1: 'AI provides more than 100+ voices',
    text_2: 'Multiple languages: English, Chinese',
    text_3: 'Variety of voices various age ranges',
    text_4: 'Save your projects to work on later',
    text_5: 'Adjust voice volume and reading speed',
    text_6: 'Self-edit mispronunciations',
    text_7: 'Compatible with smartphones',
    text_8: 'Supports visually impaired users',
    text_9: 'Provides an API for developers to use',
  },
  bottom_banner: {
    header: 'Let us help create your masterpiece',
    btn: 'Sign up for free',
  },
  why_us: {
    header: 'Why choose us?',
    header_list: 'A good AI Voiceover will help you',
    sub_list_1: 'Become more professional',
    sub_list_2: 'Save more money and time',
    sub_list_3: 'Increase likes, shares, and followers',
    sub_list_4: 'Enables you to work independently',
    text_list_1:
      'Elevate your work to look more professional, contemporary, and engaging',
    text_list_2:
      'Elevate your work to look more professional, contemporary, and engaging',
    text_list_3:
      "You'll be able to create high-quality voiceovers at an affordable price, quickly, conveniently, and easily",
    text_list_4:
      'Make your content engaging and captivating, attracting viewers, and increasing both views and followers',
  },
  review: 'User reviews',
  contact: {
    header: 'Contact us',
    name: 'Name',
    company: 'Organization name',
    email: 'Email',
    phone: 'Phone number',
    detail: 'Details',
    submit: 'Send',
  },
};

const marketplaceV3 = {
  premium: {
    premium_tag: 'Premium',
    actor_tag: 'Voice actor',
    profile: 'Profile',
    contact: 'Contact',
    hero: {
      header: 'V',
      header_2: 'ICE OVER',
      sub_header: 'PREMIUM',
      detail: 'A center for quality voice actors',
    },
    sample_picked: {
      header: 'Selected for you',
      tabs: ['Advertising', 'Character', 'Narrating'],
    },
    pros: {
      header: 'Real voice',
      header_1: 'From voice actors',
      detail:
        'Experience the benefits of authentic voice that will transform your storytelling.',
      list_item: [
        {
          header: 'Lifelike Sound',
          detail: 'Capture natural and profound vocal nuances.',
        },
        {
          header: 'Customizable',
          detail:
            'Adjust the voice to fit your products, advertisements, or various media.',
        },
        {
          header: 'Context Understanding',
          detail: 'Can understand the context of the story well.',
        },
        {
          header: 'Emotional Expression',
          detail: 'Effectively communicate emotions with the audience.',
        },
        {
          header: 'Diverse Voices',
          detail:
            'Create various voices, from characters to unique characteristics.',
        },
      ],
    },
    step: {
      header: 'Getting Started is Easy...',
      sub_header: 'Just 3 Simple Steps',
      cards: [
        {
          card_header: 'Choose a Voice',
          card_text: 'Select a voice you like.',
          card_text_2: '',
        },
        {
          card_header: 'Fill in Details',
          card_text:
            'Provide information about your project and contact details.',
        },
        {
          card_header: 'Wait for Contact',
          card_text:
            'Botnoi will act as an intermediary to connect you with the voice actor.',
        },
      ],
    },
    btm_card: {
      header: 'Renowned Voice Actors',
      header_2: 'Tailored Voices for Your Projects',
    },
    profile_page: {
      main_page: 'Main page',
      success_rate: 'Success rate',
      edit_count: 'Edit count',
      word_count: 'Word count',
      work_duration: 'Work duration',
      initial_price: 'Initial price',
      ps_card: "You won't be charged any fees yet",
      contact: 'Contact',
      genre: 'Genre',
      language: 'Language',
      sold: 'Sold',
      work_prefix: '',
      work_suffix: "'s work",
      description: 'Description',
      profile: 'Profile',
      day: 'day',
      USD: 'USD',
      times: 'times',
      btm_card: {
        header: 'Renowned Voice Actors',
        header_2: 'Tailored Voices for Your Projects',
      },
    },
    dialog_contact: {
      header: 'Job Details',
      language: 'Preferred Language *',
      type: 'Job Type *',
      duration: 'Required Voice Length *',
      description: 'Job Description or Attach Job Link *',
      upload: 'Upload File',
      date: 'Use Voice within Date *',
      addons: '*Add-ons',
      ot: 'Pay for faster service',
      ps: '*Additional charges apply',
      header_2: 'Basic Information',
      name: 'Name *',
      email: 'Email *',
      phone: 'Phone Number *',
      organization: 'Company Name (For clients hiring on behalf of a company)',
      back: 'Back',
      cancel: 'Cancel',
      confirm: 'Confirm',
      next: 'Next',
      placeholder: {
        duration: '15 seconds/1 minute/10 minutes',
        job: 'Job Information',
        name: 'Name',
        surname: 'Surname',
        email: 'Email',
        phone: 'Phone Number',
        company: 'Company Name',
      },
    },
    dialog_profile: {
      profile: 'Profile',
      voiceover: 'Voiceover',
      ai_voice: 'AI voice',
      prefered_style: 'Proficiency in',
      contact: 'Contact',
      voice_sample: 'Voice samples',
      ai_voice_sample: 'AI voice samples',
      actor: 'Voice actor',
    },
    edit_page: {
      main_page: 'Main page',
    },
  },
  free: {
    free_tag: 'Free',
    hero: {
      header: 'AI voice',
      sub_header: 'Over 100 voices',
      detail:
        'Natural-sounding AI voice service with a choice of more than 10 languages',
    },
    marketplace: {
      filter: {
        lang: 'Language',
        style: 'Style',
        categories: 'Category',
        gender: 'Gender/Age',
        selectAll: 'Select all',
        clear: 'clear',
        input_placeholder: 'Search for the voice',
      },
      result: {
        searchResult: 'Search results',
        resultAll: 'Total',
        resultList: 'speakers',
        noResult: 'No search results found',
        try: 'Try using a different name',
      },
      card: {
        addFav: 'Favorite',
        removeFav: 'Remove',
        freeVoice: 'Free voice',
        other: '+ others',
        other_lang: 'Available languages',
      },
      tab: {
        free: 'Free voice',
        favorite: 'Favorite',
      },
    },
    tooltip: {
      playSound: 'Listen',
      useVoice: 'Use this voice',
      addFav: 'Add to favorites',
      removeFav: 'Remove from favorites',
      next: 'Next',
      previous: 'Previous',
      filter: 'Search in detail',
    },
  },
  dialog_contact_buy: {
    header: 'Contact us',
    sub_header: 'Please provide information for us to contact you back',
    header_create: 'Create your own AI voice',
    name: 'Name or Company name',
    line: 'Line Id (Optional)',
    email: 'Email',
    phone: 'Phone',
    selectedVoiceLabel: 'Voice actor',
    serviceLabel: 'Select a service',
    organization: 'Organization',
    organization_name: 'Organization name',
    self_use: 'Personal usage',
    btn_cancel: 'Cancel',
    btn_submit: 'Submit',
  },
};

const footerV2 = {
  studio: 'Studio',
  voice: 'Select voices',
  dev: 'Developer',
  price: 'Price',
  docs: 'Document',
  report: 'Report problems',
  contact: 'Contact channels',
  email: 'Email: admin@botnoigroup.com',
  phone: 'Phone: 064-192-2433',
  web: 'Website: www.botnoigroup.com',
  social: 'Social media',
  toTop: 'Back to top',
};

const removeVoice = {
  header: 'Delete the selected audio box',
  body: 'Are you sure you want to delete the selected audio box?',
  checkbox: "Don't show again",
  btnCancel: 'Cancel',
  btnConfirm: 'Confirm',
};

const dialogAds = {
  header: ['The audio generated', 'will continue after the ad ends.'],
  play: 'Advertising',
  url: 'Website',
  ads: ['Special! Apply for membership for only ', ' USD, No Ads anymore.'],

  apply: 'Apply now',
  free: 'Free',
  premium: 'Premium',
  voice_front: 'voice: ',
};

const dialogResetsubscription = {
  header: 'Announcement',
  sub_header:
    'As of now, Botnoi Voice website has lifted the quota system for generating voices and discontinued the monthly and yearly package subscription system, following user requests. Instead, we have switched to a points purchase system, which offers more value and is more suitable for usage.',
  sub_header_199:
    'As Botnoi Voice website has started using the Add-on: No Ads system for customers who have a purchase history of points since the 5.99 USD promotion, starting from November 20, 2023, we would like to inform you that we have provided special privileges as follows:',
  body_yearly:
    'For customers who have subscribed to the annual package and have an active status, the Botnoi Voice team would like to inform you that we have made compensation for the changes as follows:',
  body_monthly:
    'For customers who have subscribed to the monthly package and have an active status, the Botnoi Voice team would like to inform you that we have made compensation for the changes as follows:',
  body_compensate:
    'For customers who are compensated accounts and have an active status, the Botnoi Voice team would like to inform you that we have compensated for the changes as follows:',
  compensate_list: [
    {
      text_1: 'Compensation for ',
      text_2: ' months of points for your ',
      text_3: ' account is as follows: ',
      text_4: ' points (equivalent to a value of ',
      text_5: ' USD).',
    },
    {
      text_1:
        'Upgrade to Add-on status: No ads. Enjoy an ad-free experience for ',
      text_2: ' months.',
    },
    "And you can also enter the 'botnoivip' code every time you purchase points. Using this code will give you an additional 20% points on every purchase. This code is valid until January 31, 2024.",
    'Upgrade to Add-on status: No ads. Enjoy an ad-free experience until January 31, 2024.',
  ],
  btn: 'Accept compensation',
  footer: '',
};
const historyPage = {
  title: 'Payment History',
  date: 'Day/Month/Year',
  table: ['Details', 'Tag', 'Point', ' ', 'Time'],
  tag: ['Earn Point', 'Use Point'],
  item: 'Item per page: ',
};

const mediaCenter = {
  header: ['Users', 'Botnoi Voice', 'Recommended'],
  sub_text: 'Content Channel',
  sub_text2: 'Video Content',
  subscribe: 'subscribers ',
  btn_follow: 'subscribe',
};

const subscription_management = {
  no_package: "Currently, you don't have any add-on packages",
  promotion: 'View the most worthwhile discount promotions',
  click: 'click',
};

const seo_page = {
  dialog: {
    header: 'You have 1 free trial downloads remaining for today',
    headerFull: "You've reached your free trial download limit per day",
    genFull: "You've reached your free generate voice limit per day",
    details_colored: 'Get 100 free points',
    details: ' for new users.',
    confirm: 'Try full version',
  },
  faq_list: [
    {
      title: 'What is text to speech (TTS)?',
      description:
        'Botnoi Voice is the simplest way to convert text into speech. Simply type the text to be spoken or read aloud, and then select your voiceover from the available languages or categories. After customization and generation, it is now available for download and sharing.',
    },
    {
      title: 'How to convert text to speech?',
      description:
        'Botnoi Voice is the simplest way to convert text into speech. Simply type the text to be spoken or read aloud, and then select your voiceover from the available languages or categories. After customization and generation, it is now available for download and sharing.',
    },
    {
      title: 'Do I have to subscribe to a monthly plan?',
      description:
        'Botnoi Voice is the simplest way to convert text into speech. Simply type the text to be spoken or read aloud, and then select your voiceover from the available languages or categories. After customization and generation, it is now available for download and sharing.',
    },
    {
      title: 'Do you have an API for Developer?',
      description:
        'Botnoi Voice is the simplest way to convert text into speech. Simply type the text to be spoken or read aloud, and then select your voiceover from the available languages or categories. After customization and generation, it is now available for download and sharing.',
    },
    {
      title: 'Can I try out Botnoi Voice before making a payment?',
      description:
        'Botnoi Voice is the simplest way to convert text into speech. Simply type the text to be spoken or read aloud, and then select your voiceover from the available languages or categories. After customization and generation, it is now available for download and sharing.',
    },
  ],
};

const genSoundStandalone = {
  try: 'Try for free',
  credit: 'Free credit:',
  credit_subfix: 'Downloads left / Day',
  upgrade: 'Try full version for more',
  generate: 'Generate',
  download: 'Download',
  no_credit: 'Your credits run out. Please try full version',
  full_version: 'Full version',
  clearText: 'Clear all',
  play: 'Play',
  pause: 'Pause',
  alertSelect: 'Please select the language first.',
  placeholderDefault: 'Try typing the sentence here.',
  dialog: {
    headerLogin: 'Please log in to download',
    header: 'Download Successful',
    credit: 'Your credits lefts :',
    details_colored: 'Get 100 free points',
    details: ' for new users.',
    confirm: 'Try full version',
    confirm_login: 'Log in',
  },
};

const survey = {
  careerArray: [
    {
      id: 1,
      title: 'Content creator',
      value: 'Content creator',
      desc1: 'Tiktok, Youtube',
      desc2: 'news or audio books',
      img: '../../../../assets/images/survey/display-pic-1.png',
    },
    {
      id: 2,
      title: 'Educational',
      value: 'Educational',
      desc1: 'Presentations',
      desc2: 'or Projects',
      img: '../../../../assets/images/survey/display-pic-2.png',
    },
    {
      id: 3,
      title: 'Agency /Outsource',
      value: 'Agency /Outsource',
      desc1: 'Presentations or',
      desc2: 'Product contents',
      img: '../../../../assets/images/survey/display-pic-3.png',
    },
    {
      id: 4,
      title: 'SMEs business',
      value: 'SMEs business',
      desc1: 'company size around',
      desc2: '3-5 employee',
      img: '../../../../assets/images/survey/display-pic-4.png',
    },
    {
      id: 5,
      title: 'Enterprises',
      value: 'Enterprises',
      desc1: 'Products, Projects',
      desc2: 'in large company',
      img: '../../../../assets/images/survey/display-pic-5.png',
    },
    {
      id: 6,
      title: 'Others',
      value: 'Others',
      desc1: 'Other reasons or',
      desc2: 'just for fun',
      img: '../../../../assets/images/survey/display-pic-6.png',
    },
  ],
  careerChoice: [
    {
      id: 1,
      choice: [
        {
          id: 1,
          name: 'Funny contents/Games',
          value: 'Funny contents/Games',
        },
        {
          id: 2,
          name: 'Audio books/Kids story video',
          value: 'Audio books/Kids story video',
        },
        {
          id: 3,
          name: 'News/Nonfiction/Documentary',
          value: 'News/Nonfiction/Documentary',
        },
        {
          id: 4,
          name: 'Vlogger',
          value: 'Vlogger',
        },
        {
          id: 5,
          name: 'Podcast/Life coach',
          value: 'Podcast/Life coach',
        },
        {
          id: 6,
          name: 'etc.',
          value: 'etc.',
        },
      ],
    },
    {
      id: 2,
      choice: [
        {
          id: 1,
          name: 'Student',
          value: 'Student',
        },
        {
          id: 2,
          name: 'University student',
          value: 'University student',
        },
        {
          id: 3,
          name: 'Coach/Expert/Lecturer',
          value: 'Coach/Expert/Lecturer',
        },
        {
          id: 4,
          name: 'Teacher/Professor',
          value: 'Teacher/Professor',
        },
        {
          id: 5,
          name: 'State enterprise',
          value: 'State enterprise',
        },
        {
          id: 6,
          name: 'etc.',
          value: 'etc.',
        },
      ],
    },
    {
      id: 3,
      choice: [
        {
          id: 1,
          name: 'Marketing/Ads',
          value: 'Marketing/Ads',
        },
        {
          id: 2,
          name: 'Education consult',
          value: 'Education consult',
        },
        {
          id: 3,
          name: 'Customer service',
          value: 'Customer service',
        },
        {
          id: 4,
          name: 'Explainer video',
          value: 'Explainer video',
        },
        {
          id: 5,
          name: 'Corporate training',
          value: 'Corporate training',
        },
        {
          id: 6,
          name: 'etc.',
          value: 'etc.',
        },
      ],
    },
    {
      id: 4,
      choice: [
        {
          id: 1,
          name: 'Marketing',
          value: 'Marketing',
        },
        {
          id: 2,
          name: 'Sale',
          value: 'Sale',
        },
        {
          id: 3,
          name: 'Customer service',
          value: 'Customer service',
        },
        {
          id: 4,
          name: 'Product',
          value: 'Product',
        },
        {
          id: 5,
          name: 'etc.',
          value: 'etc.',
        },
      ],
    },
    {
      id: 5,
      choice: [
        {
          id: 1,
          name: 'Marketing/Sales',
          value: 'Marketing/Sales',
        },
        {
          id: 2,
          name: 'Product/IT/Design',
          value: 'Product/IT/Design',
        },
        {
          id: 3,
          name: 'HR',
          value: 'HR',
        },
        {
          id: 4,
          name: 'Customer service',
          value: 'Customer service',
        },
        {
          id: 5,
          name: 'CEO/manager',
          value: 'CEO/manager',
        },
        {
          id: 6,
          name: 'etc.',
          value: 'etc.',
        },
      ],
    },
    {
      id: 6,
      choice: [{ id: 1, name: 'none', value: 'none' }],
    },
  ],
  age: [
    { age: 'Below 20', value: '<20' },
    { age: '20-29', value: '20-29' },
    { age: '30-39', value: '30-39' },
    { age: '40-49', value: '40-49' },
    { age: 'More than 50', value: '>50' },
  ],
  surveyhead: 'Complete 4 questions, ',
  surveyhead2: 'Get free 1200 Point',
  youremail: 'Email',
  yourage: 'Age',
  yourcountry: 'Where do you come from?',
  nearly: 'Almost done...',
  usefor: 'What do you make use of Botnoi voice?',
  youdo: 'You do...',
  ready: 'Ready to use!',
  inputemail: 'Enter your email address',
  inputother: 'What do you make use of Botnoi voice?',
  next: 'Next',
  finish: 'Finish',
  thanks1: '1,200 PT is ready for you',
  thanks2: 'Thank you for completing the survey',
  close: '1,200 PT is still waiting for you ',
  close2: 'Are you sure to left?',
  dontshow: 'Don’t show me again',
  leave: 'Leave',
  back: 'I’ll do it',
  back2: 'Back',
  selectcountry: 'Select Country',
  countries: [
    { code: 'Thailand', name: 'Thailand' },
    { code: 'United Kingdom', name: 'United Kingdom' },
    { code: 'Indonesia', name: 'Indonesia' },
    { code: 'Japan', name: 'Japan' },
    { code: 'Laos', name: 'Laos' },
    { code: 'Myanmar', name: 'Myanmar' },
    { code: 'Vietnam', name: 'Vietnam' },
    { code: 'China', name: 'China' },
    { code: 'United States', name: 'United States' },
    { code: 'Cambodia', name: 'Cambodia' },
    { code: 'Malaysia', name: 'Malaysia' },
    { code: 'Singapore', name: 'Singapore' },
    { code: 'Brunei Darussalam', name: 'Brunei Darussalam' },
    { code: 'Philippines', name: 'Philippines' },
    { code: 'Afghanistan', name: 'Afghanistan' },
    { code: 'Albania', name: 'Albania' },
    { code: 'Algeria', name: 'Algeria' },
    { code: 'Andorra', name: 'Andorra' },
    { code: 'Angola', name: 'Angola' },
    { code: 'Antigua And Barbuda', name: 'Antigua And Barbuda' },
    { code: 'Argentina', name: 'Argentina' },
    { code: 'Armenia', name: 'Armenia' },
    { code: 'Aruba', name: 'Aruba' },
    { code: 'Australia', name: 'Australia' },
    { code: 'Austria', name: 'Austria' },
    { code: 'Azerbaijan', name: 'Azerbaijan' },
    { code: 'Bahamas', name: 'Bahamas' },
    { code: 'Bahrain', name: 'Bahrain' },
    { code: 'Bangladesh', name: 'Bangladesh' },
    { code: 'Barbados', name: 'Barbados' },
    { code: 'Belarus', name: 'Belarus' },
    { code: 'Belgium', name: 'Belgium' },
    { code: 'Belize', name: 'Belize' },
    { code: 'Benin', name: 'Benin' },
    { code: 'Bhutan', name: 'Bhutan' },
    { code: 'Bolivia', name: 'Bolivia' },
    { code: 'Bosnia', name: 'Bosnia' },
    { code: 'Botswana', name: 'Botswana' },
    { code: 'Brazil', name: 'Brazil' },
    { code: 'Bulgaria', name: 'Bulgaria' },
    { code: 'Burkina Faso', name: 'Burkina Faso' },
    { code: 'Burundi', name: 'Burundi' },
    { code: 'Cameroon', name: 'Cameroon' },
    { code: 'Canada', name: 'Canada' },
    { code: 'Cape Verde', name: 'Cape Verde' },
    { code: 'Central African Republic', name: 'Central African Republic' },
    { code: 'Chad', name: 'Chad' },
    { code: 'Chile', name: 'Chile' },
    { code: 'Colombia', name: 'Colombia' },
    { code: 'Comoros', name: 'Comoros' },
    { code: 'Congo', name: 'Congo' },
    { code: 'Costa Rica', name: 'Costa Rica' },
    { code: "Cote D'Ivoire", name: "Cote D'Ivoire" },
    { code: 'Croatia', name: 'Croatia' },
    { code: 'Cuba', name: 'Cuba' },
    { code: 'Cyprus', name: 'Cyprus' },
    { code: 'Czech Republic', name: 'Czech Republic' },
    { code: 'Denmark', name: 'Denmark' },
    { code: 'Djibouti', name: 'Djibouti' },
    { code: 'Dominica', name: 'Dominica' },
    { code: 'Dominican Republic', name: 'Dominican Republic' },
    { code: 'Ecuador', name: 'Ecuador' },
    { code: 'Egypt', name: 'Egypt' },
    { code: 'El Salvador', name: 'El Salvador' },
    { code: 'Equatorial Guinea', name: 'Equatorial Guinea' },
    { code: 'Eritrea', name: 'Eritrea' },
    { code: 'Estonia', name: 'Estonia' },
    { code: 'Ethiopia', name: 'Ethiopia' },
    { code: 'Fiji', name: 'Fiji' },
    { code: 'Finland', name: 'Finland' },
    { code: 'France', name: 'France' },
    { code: 'Gabon', name: 'Gabon' },
    { code: 'Gambia', name: 'Gambia' },
    { code: 'Georgia', name: 'Georgia' },
    { code: 'Germany', name: 'Germany' },
    { code: 'Ghana', name: 'Ghana' },
    { code: 'Greece', name: 'Greece' },
    { code: 'Greenland', name: 'Greenland' },
    { code: 'Grenada', name: 'Grenada' },
    { code: 'Guam', name: 'Guam' },
    { code: 'Guatemala', name: 'Guatemala' },
    { code: 'Guinea', name: 'Guinea' },
    { code: 'Guinea-Bissau', name: 'Guinea-Bissau' },
    { code: 'Guyana', name: 'Guyana' },
    { code: 'Haiti', name: 'Haiti' },
    {
      code: 'Holy See (Vatican City State)',
      name: 'Holy See (Vatican City State)',
    },
    { code: 'Honduras', name: 'Honduras' },
    { code: 'Hungary', name: 'Hungary' },
    { code: 'Iceland', name: 'Iceland' },
    { code: 'India', name: 'India' },
    { code: 'Iran', name: 'Iran' },
    { code: 'Iraq', name: 'Iraq' },
    { code: 'Ireland', name: 'Ireland' },
    { code: 'Israel', name: 'Israel' },
    { code: 'Italy', name: 'Italy' },
    { code: 'Jamaica', name: 'Jamaica' },
    { code: 'Jordan', name: 'Jordan' },
    { code: 'Kazakhstan', name: 'Kazakhstan' },
    { code: 'Kenya', name: 'Kenya' },
    { code: 'Kiribati', name: 'Kiribati' },
    { code: 'South Korea', name: 'South Korea' },
    { code: 'North Korea', name: 'North Korea' },
    { code: 'Kuwait', name: 'Kuwait' },
    { code: 'Kyrgyzstan', name: 'Kyrgyzstan' },
    { code: 'Latvia', name: 'Latvia' },
    { code: 'Lebanon', name: 'Lebanon' },
    { code: 'Lesotho', name: 'Lesotho' },
    { code: 'Liberia', name: 'Liberia' },
    { code: 'Libyan', name: 'Libyan' },
    { code: 'Liechtenstein', name: 'Liechtenstein' },
    { code: 'Lithuania', name: 'Lithuania' },
    { code: 'Luxembourg', name: 'Luxembourg' },
    { code: 'Macedonia', name: 'Macedonia' },
    { code: 'Madagascar', name: 'Madagascar' },
    { code: 'Malawi', name: 'Malawi' },
    { code: 'Maldives', name: 'Maldives' },
    { code: 'Mali', name: 'Mali' },
    { code: 'Malta', name: 'Malta' },
    { code: 'Mauritania', name: 'Mauritania' },
    { code: 'Mauritius', name: 'Mauritius' },
    { code: 'Mexico', name: 'Mexico' },
    { code: 'Micronesia', name: 'Micronesia' },
    { code: 'Moldova', name: 'Moldova' },
    { code: 'Monaco', name: 'Monaco' },
    { code: 'Mongolia', name: 'Mongolia' },
    { code: 'Montenegro', name: 'Montenegro' },
    { code: 'Montserrat', name: 'Montserrat' },
    { code: 'Morocco', name: 'Morocco' },
    { code: 'Mozambique', name: 'Mozambique' },
    { code: 'Namibia', name: 'Namibia' },
    { code: 'Nauru', name: 'Nauru' },
    { code: 'Nepal', name: 'Nepal' },
    { code: 'Netherlands', name: 'Netherlands' },
    { code: 'New Zealand', name: 'New Zealand' },
    { code: 'Nicaragua', name: 'Nicaragua' },
    { code: 'Niger', name: 'Niger' },
    { code: 'Nigeria', name: 'Nigeria' },
    { code: 'Norway', name: 'Norway' },
    { code: 'Oman', name: 'Oman' },
    { code: 'Pakistan', name: 'Pakistan' },
    { code: 'Palau', name: 'Palau' },
    { code: 'Palestine', name: 'Palestine' },
    { code: 'Panama', name: 'Panama' },
    { code: 'Papua New Guinea', name: 'Papua New Guinea' },
    { code: 'Paraguay', name: 'Paraguay' },
    { code: 'Peru', name: 'Peru' },
    { code: 'Poland', name: 'Poland' },
    { code: 'Portugal', name: 'Portugal' },
    { code: 'Qatar', name: 'Qatar' },
    { code: 'Romania', name: 'Romania' },
    { code: 'Russia', name: 'Russia' },
    { code: 'Rwanda', name: 'Rwanda' },
    { code: 'Samoa', name: 'Samoa' },
    { code: 'San Marino', name: 'San Marino' },
    { code: 'Sao Tome And Principe', name: 'Sao Tome And Principe' },
    { code: 'Saudi Arabia', name: 'Saudi Arabia' },
    { code: 'Senegal', name: 'Senegal' },
    { code: 'Serbia', name: 'Serbia' },
    { code: 'Seychelles', name: 'Seychelles' },
    { code: 'Sierra Leone', name: 'Sierra Leone' },
    { code: 'Slovakia', name: 'Slovakia' },
    { code: 'Slovenia', name: 'Slovenia' },
    { code: 'Somalia', name: 'Somalia' },
    { code: 'South Africa', name: 'South Africa' },
    { code: 'Spain', name: 'Spain' },
    { code: 'Sri Lanka', name: 'Sri Lanka' },
    { code: 'Sudan', name: 'Sudan' },
    { code: 'Suriname', name: 'Suriname' },
    { code: 'Swaziland', name: 'Swaziland' },
    { code: 'Sweden', name: 'Sweden' },
    { code: 'Switzerland', name: 'Switzerland' },
    { code: 'Syrian', name: 'Syrian' },
    { code: 'Taiwan', name: 'Taiwan' },
    { code: 'Tajikistan', name: 'Tajikistan' },
    { code: 'Tanzania', name: 'Tanzania' },
    { code: 'Timor-Leste', name: 'Timor-Leste' },
    { code: 'Togo', name: 'Togo' },
    { code: 'Tonga', name: 'Tonga' },
    { code: 'Trinidad And Tobago', name: 'Trinidad And Tobago' },
    { code: 'Tunisia', name: 'Tunisia' },
    { code: 'Turkey', name: 'Turkey' },
    { code: 'Turkmenistan', name: 'Turkmenistan' },
    { code: 'Tuvalu', name: 'Tuvalu' },
    { code: 'Uganda', name: 'Uganda' },
    { code: 'Ukraine', name: 'Ukraine' },
    { code: 'United Arab Emirates', name: 'United Arab Emirates' },
    { code: 'Uruguay', name: 'Uruguay' },
    { code: 'Uzbekistan', name: 'Uzbekistan' },
    { code: 'Vanuatu', name: 'Vanuatu' },
    { code: 'Venezuela', name: 'Venezuela' },
    { code: 'Yemen', name: 'Yemen' },
    { code: 'Zambia', name: 'Zambia' },
    { code: 'Zimbabwe', name: 'Zimbabwe' },
  ],
};
const enterprise = {
  header: {
    head1: 'Unlimited for companies.',
    head2: 'The more you use it as a team, the cheaper it gets!',
  },
  type: {
    month: 'Monthly',
    year: 'Yearly',
  },
  perk: {
    titleperk1: 'Unlimited downloads.',
    titleperk2: 'No ads,',
    perk1: 'No worries about points.',
    perk2: 'worry-free.',
  },
  contact: 'Contact us.',
  yeartag: 'Cheaper.',
  toggle: {
    monthbutton: 'Monthly',
    yearbutton: 'Yearly',
    free2month: 'Free 2 months.',
  },
};

const errorMessageMapping: TErrorMessageMapping = {
  signIn: {
    'auth/user-not-found': 'Invalid email.',
    'auth/wrong-password': 'Invalid password.',
  },
  signUp: {
    'auth/email-already-in-use': 'Email already in use.',
    'auth/invalid-email': 'Invalid email.',
    'auth/weak-password': 'Password must be more than 6 characters.',
    'own/passwords-not-match': `Passwords don't match.`,
  },
  forgotPassword: {},
  share: {
    required: 'You must enter a value.',
  },
};
const studioMobileFirst = {
  bottomNav: {
    save_success: 'Project saved successfully',
    download_alert: 'Please generate the sound first',
    edit_word: 'Edit misread',
    play_all: 'Play all',
    download: 'Download',
    save: 'Save',
  },
  box: {
    generate: 'Generate',
    download: 'Download',
    lang_des: '(Please set language to match input)',
    select_des: '(Please select voice)',
    select_voice: 'Select voice',
    mainLang: 'Main Language',
    addonsLang: 'Additional Language',
    alert_exceed: 'Exceeded character limit',
    snackbar: [
      {
        sound_success: 'Sound generated successfully',
        sound_error: 'Unable to generate sound',
      },
    ],
    drag: {
      top: 'Move to the top',
      up: 'Move up',
      down: 'Move down',
      bot: 'Move to the bottom',
    },
    options: {
      switch: 'Swap positions',
      add_above: 'Insert sound above',
      add_below: 'Insert sound below',
    },
  },
};

export const EN = {
  navbarObj: Navbar[0],
  landingPageObj: LandingPage[0],
  text2speechObj: text2speech[0],
  feedbackFromObj: feedback_form[0],
  wordStoreObj: word_store[0],
  audioStorageObj: audio_storage[0],
  walletObj: wallet[0],
  marketplaceObj: marketplace[0],
  apitutorialObj: api_tutorial[0],
  shareObj: share[0],
  addcartAlertObj: addcart_alert[0],
  dialogObj: dialog[0],
  audioPlanObj: audioPlan[0],
  bottomMenuObj: bottomMenu[0],
  dialogconfirmObj: dialogconfirm[0],
  addworddialogObj: addworddialog[0],
  audioDownloadObj: audio_download[0],
  salesObj: sales,
  authServiceObj: _auth,
  dialogMessageObj: dialogMessageObj,
  dialogServiceObj: dialogService,
  firebaseAuthObj: firebaseAuth,
  campaignObj: campaign,
  soundTestObj: soundTest,
  popupObj: popupObj,
  agreementObj: agreement,
  blacklistObj: blacklist,
  longwordObj: longword,
  audioObj: audio,
  storageObj: storage,
  workspaceObj: workspace,
  subscriptionObj: subscription,
  importexportObj: importexport,
  leavePageObj: leaveAlert,
  userObj: userObj,
  newsObj: newsObj,
  historyAlertObj: historyAlert,
  quoteObj: quoteObj,
  selectVoiceObj: selectVoiceDialog,
  patchNoteObj: patchNoteObj,
  dialogPaid: dialogPaid,
  marketplace_v2_Obj: marketplace_v2_Obj,
  report: report,
  quotaDialogObj: quotaDialog,
  maintenance: maintenance,
  upsell,
  landingPageV3Obj: landingPageV3,
  marketplaceV3Obj: marketplaceV3,
  footerV2Obj: footerV2,
  removeVoiceObj: removeVoice,
  dialogAds,
  dialogResetsubscription,
  historyPageObj: historyPage,
  mediaCenter,
  subscriptionManagementObj: subscription_management,
  seoPageObj: seo_page,
  surveyObj: survey,
  genSoundStandalone: genSoundStandalone,
  promotionEnterpriseObj: enterprise,
  errorMessageMapping,
  studioMobileFirstObj: studioMobileFirst,
};
