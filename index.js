var parser = require('xml2json');
var fs = require('fs');
var Entities = require('html-entities').AllHtmlEntities;
var prettyjson = require('prettyjson');

entities = new Entities();

var xml = fs.readFileSync('wordpress-posts.xml').toString();
var obj = parser.toJson(xml,
 {object: true});
var posts = obj['rss']['channel']['item'];

  for (var key in posts) {

	// pull out data you need
	var post = posts[key];
	var data = {
		'slug':post['wp:post_name'],
		'title':post['title'],
		"category":[],
		"tags":[],
		'date':post['wp:post_date'],
		'author':post['dc:creator'],
		"image_file":"",
		"excerpt":"",
		'full_copy':entities.decode(post['content:encoded'].replace(/&amp;/g, '&')),
		"comments":[]
		};

//image finder
var re = /src\s*=\s*"(.+?)"/g;
var str = data['full_copy'];
var findImg = str.match(re);
if (findImg === null){
  console.log('');
}else{
  console.log(findImg);
}


	fs.writeFileSync('./posts/' + data['slug'] + '.php', '<?php' + JSON.stringify(data));
	console.log('Parse on article ' + key + ' complete')
 }
