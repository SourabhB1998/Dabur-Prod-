$.ajaxSetup({
  beforeSend: function (xhr) {
    xhr.setRequestHeader('Content-type', 'application/json');
   xhr.setRequestHeader('Authorization', 'Bearer-eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3VyYWJoLmJpc2h0QGRpZ2lseXRpY3MuYWkiLCJqdGkiOiIzMTUiLCJhdXRoIjoiUk9MRV9WSVNDT05fQURNSU4iLCJjb21wYW55SWQiOiIzIiwic2Vzc2lvbklkIjoiZmU0ODA1Nzg5NDhiNDgwNzhhNzlhMDdmZmIyNGRlMTYiLCJleHAiOjE2NzkyODk3NTh9.ozLO7iLQwHc4H8y69MSleHE_ofoIiNv_gQIDPN4wk37M5SgUJs0Du6nG7nhmPeaxSkzhsDYZKIP2eV4urMHGOg')
  }
});