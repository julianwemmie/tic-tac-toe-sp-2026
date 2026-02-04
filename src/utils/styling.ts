

// export const getTTTBordersByIndex = (index: number) => {
//   let borders = {
//     borderTop: 'solid',
//     borderBottom: 'solid',
//     borderLeft: 'solid',
//     borderRight: 'solid'
//   }
//   if ([0, 1, 2].includes(index)) {
//     borders = {
//       ...borders,
//       borderTop: 'none',
//     }
//   }
//   if ([0, 3, 6].includes(index)) {
//     borders = {
//       ...borders,
//       borderLeft: 'none'
//     }
//   }
//   if ([2, 5, 8].includes(index)) {
//     borders = {
//       ...borders,
//       borderRight: 'none'
//     }
//   }
//   if ([6, 7, 8].includes(index)) {
//     borders = {
//       ...borders,
//       borderBottom: 'none'
//     }
//   }
//   return borders
// }

export const getTTTBordersByIndex = (index: number, width: string = '1px', color: string = 'black') => {
  const borders = []
  // borders.push('inset 1px 0 0 0 black') // left
  // borders.push('inset -1px 0 0 0 black') // right
  // borders.push('inset 0 1px 0 0 black') // top
  // borders.push('inset 0 -1px 0 0 black') // bottom
  if ([0, 1, 2].includes(index)) {
    borders.push(`inset 0 -${width} 0 0 ${color}`) // bottom
  }
  if ([3, 4, 5].includes(index)) {
    borders.push(`inset 0 -${width} 0 0 ${color}`) // bottom
  }
  if ([0, 3, 6].includes(index)) {
    borders.push(`inset -${width} 0 0 0 ${color}`) // right
  }
  if ([1, 4, 7].includes(index)) {
    borders.push(`inset -${width} 0 0 0 ${color}`) // right
  }
  return {
    boxShadow: borders.join(',')
  }
}
