export const highlight_fromArr = (_text: string, _arrWord: any[]) => {

  // return new Promise<{ soundtext:string, html:string, isReplace:boolean }>((resolve) => {

  let soundtext: any = _text;
  let html: any = _text;
  let arrWord = _arrWord;
  let isReplace = false;

  if (_arrWord.length > 0) {

    for (let i = 0; i < arrWord.length; i++) {

      const word = arrWord[i];

      //replace word
      soundtext = soundtext.replaceAll(word.before_text, word.after_text);


      let index_ = html.indexOf(word.before_text);

      const highlightcolor = (index_w: any) => {

        if (index_w >= 0) {

          isReplace = true;

          html = html.substring(0, index_w) + "<b contenteditable='false'>" +
            html.substring(index_w, index_w + word.before_text.length) + "</b>" +
            html.substring(index_w + word.before_text.length, html.length) + " ";

          //"<b contenteditable='false'>" 31 ตัว

          let index_word_next = html.substring(index_w + 31 + word.before_text.length, html.length).indexOf(word.before_text);

          if (index_word_next >= 0) {

            index_word_next += index_w + word.before_text.length + 31;

            highlightcolor(index_word_next)
          }
          else {
            // resolve({ soundtext, html, isReplace })
          }

        }

      }
      highlightcolor(index_);
    }

  }
  else {
    //   resolve({ soundtext, html, isReplace })
  }

  // })
  const temp = {
    soundtext: soundtext as string,
    html: html,
    isReplace: isReplace,
  }

  return temp
}
