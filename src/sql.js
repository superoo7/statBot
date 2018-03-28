let searchTag = tag => `
select
 SUM(net_votes) as Votes,
 SUM(pending_payout_value) as PendingPayouts,
 SUM(children) as Comments,
 COUNT(*) as Posts
from
 Comments (NOLOCK)
where
 dirty = 'False' and
 CONTAINS(json_metdata, ‘${tag}’) and
 parent_author = '' and
 datediff(day, created, GETDATE()) between 0 and 7
order by
 Votes desc
  `;

export { searchTag };
