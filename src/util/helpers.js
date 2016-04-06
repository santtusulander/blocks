import numeral from 'numeral'

export function formatBytes(bytes) {
  let formatted = numeral(bytes / 1000000000000000).format('0,0')+' PB'
  if(bytes < 1000) {
    formatted = numeral(bytes).format('0,0')+' B'
  }
  else if(bytes < 1000000) {
    formatted = numeral(bytes / 1000).format('0,0')+' KB'
  }
  else if(bytes < 1000000000) {
    formatted = numeral(bytes / 1000000).format('0,0')+' MB'
  }
  else if(bytes < 1000000000000) {
    formatted = numeral(bytes / 1000000000).format('0,0')+' GB'
  }
  else if(bytes < 1000000000000000) {
    formatted = numeral(bytes / 1000000000000).format('0,0')+' TB'
  }
  return formatted
}
