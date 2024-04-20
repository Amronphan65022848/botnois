const paymentModule = ['nav_buyPT_btn', 'nav_addon_btn', '', '', ''];

const inputPoint = {
  input: 'promotion_Indicate_buyPT_input',
  btn: 'promotion_Indicate_buyPT_btn',
};

const buyPoint = {
  expand: [
    'starter_expand_toggle',
    'regular_expand_toggle',
    'professional_expand_toggle',
    'buffet_expand_toggle',
  ],

  buypoint_package: [
    'starter_buyPT_pack',
    'hob_buyPT_pack',
    'professional_buyPT_pack',
    'buf_buyPT_pack',
    '',
    'eventPack_buyPT_pack',
  ],
  inputPoint,
};

const dialogPaid = {
  method: ['popup_pm_qrcode_btn', 'popup_pm_card_btn'],
  code: {
    expand: 'popup_pm_inputcode_dropdown',
    input: 'popup_pm_inputcode',
    btn: 'popup_pm_inputcode_confirm',
  },
  button: {
    cancel: 'popup_pm_cancel_btn',
    confirm: 'popup_pm_confirm_btn',
    close: 'popup_pm_close',
  },
};

const subscription = {
  addon_on_subscription: [
    'addon_NoAds_regist_btn',
    'addon_MoreText_regist_btn',
  ],

  close: 'popup_Noads_close_btn',
  item_on_dialog: [
    'popup_NoAds_buyPT_pack1_btn',
    'popup_Noads_buyPT_packnoads_btn',
  ],
  event_item_on_dialog: [
    'popup_NoAds_buyPT_event_pack1_btn',
    'popup_NoAds_buyPT_event_pack2_btn',
  ],
};

const downloadNoPoint = {
  item_on_dialog: [
    'popup_notEnoughPT_buy_pack1',
    'popup_notEnoughPT_buy_pack2',
    'popup_notEnoughPT_buy_pack3',
  ],
  inputPoint: {
    input: 'popup_notEnoughPT_Indicate_input',
    btn: 'popup_notEnoughPT_Indicate_buy_btn',
  },
  seemore: 'popup_notEnoughPT_seemore_btn',
  close: 'popup_notEnoughPT_close_btn',
  event_item_on_dialog: [
    'popup_notEnoughPT_event_buy_pack1',
    'popup_notEnoughPT_event_buy_pack2',
  ],
};

const payment = {
  paymentModule,
  buyPoint,
  dialogPaid,
  subscription,
  downloadNoPoint,
};

export const analyticId = {
  payment,
};
