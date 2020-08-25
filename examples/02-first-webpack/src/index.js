import moment from 'moment'

function foo () {
  document.getElementById('app').innerHTML = moment().format('dddd')
}

foo()
