let searchTag = (tag: string): string => `
select
 SUM(net_votes) as Votes,
 SUM(pending_payout_value) as PendingPayouts,
 SUM(children) as Comments,
 COUNT(*) as Posts
from
 Comments 
where
 depth = 0 AND
 CONTAINS(json_metadata, '${tag}') and
 datediff(day, created, GETDATE()) between 0 and 7
order by
 Votes desc
  `

let searchAllTag = (tag: string): string => `
select
 SUM(net_votes) as Votes,
 SUM(pending_payout_value) as PendingPayouts,
 SUM(children) as Comments,
 COUNT(*) as Posts
from
 Comments
where
 depth = 0 AND
 created >= '2017/01/01' AND
 CONTAINS(json_metadata, '${tag}')
order by
 Votes desc
  `

let checkDelegator = (username: string) => `
SELECT
  delegator, vesting_shares, timestamp
FROM
  TxDelegateVestingShares
WHERE 
  delegatee = '${username}'
ORDER BY
  timestamp desc
`

export { searchTag, searchAllTag, checkDelegator }
