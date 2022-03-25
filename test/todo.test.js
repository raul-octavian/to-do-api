
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

describe('User workflow test', () => {

  it('register and login a user, create a todo, modify todo, test for other statuses, and verify it is in the database, delete todo, verify empy database', (done) => {

    //register user
    let user = {
      email: 'testUser@test.com',
      name: 'Test User',
      password: '1234567890'
    }
    let login = {
      email: 'testUser@test.com',
      password: '1234567890'
    }

    chai.request(server)
      .post('/api/user/register')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.be.eql(201);
        expect(res.body.error).to.be.eql(null)
        expect(res.body.data).to.be.a('string');


        //Login the user 
        chai.request(server)
          .post('/api/user/login')
          .send(login)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql(null);
            res.body.data.should.have.property('user_id').be.a('string');
            res.body.data.should.have.property('token').be.a('string');
            let token = res.body.data.token;
            let userId = res.body.data.user_id;

            let toDoReqBody = {
              title: "test title",
              description: "party all day long",
              time: 1000,
              user_id: res.body.data.user_id
            };


            //create a todo entry
            chai.request(server)
              .post(`/api/todo/create/${userId}`)
              .set({ "auth-token": token })
              .send(toDoReqBody)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                res.body[0].should.have.property('status').eql(0);
                res.body[0].should.have.property('_id').be.a('string');
                let todoId = res.body[0]._id;


                // update toto

                chai.request(server)
                  .put(`/api/todo/${userId}/${todoId}`)
                  .set({ "auth-token": token })
                  .send({
                    status: 2
                  })
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('todo updated successfully');


                    //get all todos for user

                    chai.request(server)
                      .get(`/api/todo/${userId}`)
                      .set({ "auth-token": token })
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.should.have.lengthOf(1);


                        // get unfinished todos, should throw an error
                        chai.request(server)
                          .get(`/api/todo/todoList/${userId}`)
                          .set({ "auth-token": token })
                          .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('there are no unfinished todo items wright now')

                            // get active todos, should throw an error

                            chai.request(server)
                              .get(`/api/todo/doing/${userId}`)
                              .set({ "auth-token": token })
                              .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.be.a('object');
                                res.body.should.have.property('message').eql('there are no todo items active wright now')


                                // get done todos

                                chai.request(server)
                                  .get(`/api/todo/complete/${userId}`)
                                  .set({ "auth-token": token })
                                  .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    res.body.should.have.lengthOf(1);


                                    //get one todo

                                    chai.request(server)
                                      .get(`/api/todo/${userId}/${todoId}`)
                                      .set({ "auth-token": token })
                                      .end((err, res) => {
                                        res.should.have.status(200);
                                        res.body.should.be.a('object');
                                        res.body.should.have.property('_id').eql(todoId)

                                        // delete todo

                                        chai.request(server)
                                          .delete(`/api/todo/${userId}/${todoId}`)
                                          .set({ "auth-token": token })
                                          .end((err, res) => {
                                            res.should.have.status(204);

                                            // check database for no return
                                            chai.request(server)
                                              .get(`/api/todo/${userId}`)
                                              .set({ "auth-token": token })
                                              .end((err, res) => {
                                                res.should.have.status(400);
                                                res.body.should.have.property('message').eql('there are no todo items in your list, create some')
                                                done()
                                              })
                                          })
                                      })
                                  })
                              })
                          })
                      })
                  })
              })
          })
      })
  })
})