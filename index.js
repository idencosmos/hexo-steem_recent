var steem = require('steem');
var cnt=0;
var query = {
  "tag": "",
  "limit": 100
};

function updateSteemArticles(username) {  
  query.tag= username;
  steem.api.getDiscussionsByBlog(query, function(err, result) {
    for (var i = 0; i < result.length-1; i++) {
      const { title, body, category, author, permlink, created, json_metadata } = result[i];
      if (result[i].author == username || hexo.config.steem_resteems) {
        const tags = JSON.parse(json_metadata).tags || [];
        const date = new Date(`${created}Z`);
        const content = body.replace(/\|/g, '|').replace(/%/g, '％').replace(/{/g, '｛').replace(/}/g, '｝');
        // let t = title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“');//.replace(/\[|\]|:|-|#|\(|\)|\'/g, '').replace('?', '').replace('?', '');
        // console.log(t, tags);
        hexo.post.create({
          path: '_steemit/' + `${created.replace('T', '-')}-${category}`,
          title: title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“'),
          content,
          date,
          category: 'Uncategorized',
          tags,
          author,
        }, true)
      }
    }
    cnt=result.length;
    if(cnt<100){
      const { title, body, category, author, permlink, created, json_metadata } = result[cnt-1];
      if (result[cnt-1].author == username || hexo.config.steem_resteems) {
        const tags = JSON.parse(json_metadata).tags || [];
        const date = new Date(`${created}Z`);
        const content = body.replace(/\|/g, '|').replace(/%/g, '％').replace(/{/g, '｛').replace(/}/g, '｝');
        // let t = title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“');//.replace(/\[|\]|:|-|#|\(|\)|\'/g, '').replace('?', '').replace('?', '');
        // console.log(t, tags);
        hexo.post.create({
          path: '_steemit/' + `${created.replace('T', '-')}-${category}`,
          title: title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“'),
          content,
          date,
          category: 'Uncategorized',
          tags,
          author,
        }, true)
      }   
      return;
    }
    else{
      query.start_author= result[cnt-1].author; 
      query.start_permlink= result[cnt-1].permlink;
      console.log(query);

      updateSteemArticles(username); 
    }
  });
}

if (hexo.config.steem_users) {
  for (var i = 0; i < hexo.config.steem_users.length; i++) {
    updateSteemArticles(hexo.config.steem_users[i])
  }
} else {
  console.log('No steem usernames found, please add to the _config.yml')
}
