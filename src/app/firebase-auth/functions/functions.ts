import { TAuthPage } from 'src/app/auth/models/auth-model';
import { TFirebaseAuth } from '../models/firebase-auth-model';

type TPartialAutePage = Partial<{ [key in TAuthPage]: string }>;

export function getTitleAndButtonMapping(page: TAuthPage, text: TFirebaseAuth) {
  const commonMapping: TPartialAutePage = {
    SignUp: text.sign_up,
    SignIn: text.sign_in,
    ForgotPassword: text.options.forget_password,
    ResetPassword: text.options.forget_password,
  };

  const titleMapping: TPartialAutePage = {
    State__CreateAccount: text.sign_up_popup.header,
    State__Success_VerifyEmail: text.verify_popup.header,
    State__SendPassword: text.options.reset_password,
    State__Success_ResetPassword: text.options.reset_password_complete,
  };

  const buttonMapping: TPartialAutePage = {
    State__CreateAccount: text.sign_up_popup.accept,
    State__Success_VerifyEmail: text.verify_popup.accept,
    State__SendPassword: text.sign_up_popup.accept,
    State__Success_ResetPassword: text.verify_popup.accept,
  };

  const descriptionMapping: TPartialAutePage = {
    State__CreateAccount: text.sign_up_popup.text,
    State__SendPassword: text.options.text,
  };

  const sendAtMapping: TPartialAutePage = {
    State__CreateAccount: text.sign_up_popup.send_at,
    State__SendPassword: text.sign_up_popup.send_at,
  };

  // const textMapping = {
  //   State__CreateAccount: {
  //     description: text.sign_up_popup.text,
  //     send_at: text.sign_up_popup.send_at,
  //   },
  //   State__SendPassword: {
  //     description: text.options.text,
  //     send_at: text.options.text,
  //   },
  // };

  const title = titleMapping[page] || commonMapping[page];
  const button = buttonMapping[page] || commonMapping[page];
  const description = descriptionMapping[page];
  const sendAt = sendAtMapping[page];
  // const group__text = textMapping[page];

  return { title, button, description, sendAt };
}
