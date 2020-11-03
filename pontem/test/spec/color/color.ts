const GREEN_COLOR = '$(tput setaf 2)'
const RED_COLOR = '$(tput setaf 1)'
const NO_COLOR = '$(tput sgr0)'

export function* colorOneTime () {
  yield `echo "display ${GREEN_COLOR}Hello World${NO_COLOR} in green"`
}

export function* colorTwoTime () {
  yield `echo "display ${GREEN_COLOR}Hello World${NO_COLOR} in green"`
  yield `echo "display ${RED_COLOR}Hello Yourself${NO_COLOR} in red"`
}
