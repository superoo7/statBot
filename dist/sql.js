"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var searchTag = function searchTag(tag) {
  return "\nselect\n SUM(net_votes) as Votes,\n SUM(pending_payout_value) as PendingPayouts,\n SUM(children) as Comments,\n COUNT(*) as Posts\nfrom\n Comments (NOLOCK)\nwhere\n dirty = 'False' and\n json_metadata LIKE('%\"" + tag + "\"%') and\n  parent_author = '' and\n datediff(day, created, GETDATE()) between 0 and 7\norder by\n Votes desc\n  ";
};

exports.searchTag = searchTag;
//# sourceMappingURL=sql.js.map