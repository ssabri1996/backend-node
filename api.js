var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://localhost:3030/admin/me/suits',
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(Object.keys(response.data[1]));
})
.catch(function (error) {
  console.log(error);
});
