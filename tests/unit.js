// casperjs test --includes=../client/firstProcess.js unit.js

casper.test.begin("FirstProcess.computeA", function(test) {
  test.assertEquals(FirstProcess.computeA(1), 2);
  test.assertEquals(FirstProcess.computeA(2), 4);
  test.done();
});