var Book, Summary;

Book = bookshelf.Model.extend({
  tableName: 'books',
  summary: function() {
    return this.hasOne(Summary);
  }
});

Summary = bookshelf.Model.extend({
  tableName: 'summaries',
  book: function() {
    return this.belongsTo(Book);
  }
});
