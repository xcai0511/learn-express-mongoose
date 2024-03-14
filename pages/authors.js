let Author = require('../models/author');

get_author_list = async () => {
  // let authors_list = [];
  // return authors_list.map(function(author) {
  //   return author.name + " : " + author.lifespan;
  // });
  let authors_list = await Authos.find()
      .sort([['family_name', 'ascending']])
      .exec()
  return authors_list.map(function(author) {
    return author.name + " : " + author.lifespan;
  });
};

exports.show_all_authors = function(res) {
  get_author_list()
    .then((data) => res.send(data))
    .catch((_) => res.send('No authors found'));
}
