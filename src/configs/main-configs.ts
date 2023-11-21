export const verifyStatusSelections = [
  {
    text: 'Pending',
    value: 'PENDING',
  },
  {
    text: 'Verified',
    value: 'VERIFIED',
  },
  {
    text: 'Rejected',
    value: 'REJECTED',
  },
]

export function getVerifyStatusColor(verifyStatus: string) {
  switch (verifyStatus) {
    case 'PENDING':
      return 'white'
    case 'VERIFIED':
      return 'success'
    case 'REJECTED':
      return 'error'
  }
}