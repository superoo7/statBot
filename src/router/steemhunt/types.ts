// source: https://github.com/Steemhunt/web/blob/4f3c11be8263629183e195f1c9df19c3c8bc0e3e/src/features/User/utils.js
export const influencer: string[] = [
  'elleok',
  'chuuuckie',
  'mobi72',
  'fruitdaddy',
  'karamyog',
  'elsiekjay',
  'calprut',
  'ninuola',
  'sonrhey',
  'dayjee',
  'camzy',
  'abasifreke',
  'gentleshaid',
  'aamirijaz',
  'tio',
  'azwarrangkuti',
  'ikrahch',
  'rodus',
  'sanach',
  'alikoc07'
]

export interface IApiData {
  id: number
  author: string
  url: string
  title: string
  tagline: string
  tags: string[]
  images: { name: string; link: string }[]
  beneficiaries: any[]
  permlink: string
  is_active: boolean
  payout_value: number
  active_votes: {
    voter: string
    weight: number
    rshares: string
    percent: number
    reputation: string
    time: string
  }[]
  children: number
  created_at: string
  updated_at: string
  description: string
  is_verified: boolean
  verified_by: string
  hunt_score: number
  valid_votes: {
    voter: string
    percent: number
    weight: number
    score: number
  }[]
  listed_at: number
}
