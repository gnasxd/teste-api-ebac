/// <reference types= "cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let token
  beforeEach(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => {
      token = tkn
    })
  
  });

  it.only('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
  })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios',
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it.only('Deve cadastrar um usuário com sucesso', () => {
    let usuario = ' Usuario EBAC ' + Math.floor(Math.random() * 10000000)
      let email = 'ebac' + Math.floor(Math.random() * 10000000) + '@teste.com'
  let senha = 'teste123'
   cy.cadastrarUsuario(token, usuario, email, senha)
    .then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  })
    
  it('Deve validar um usuário com email inválido', () => {
    let usuario = ' Usuario EBAC ' + Math.floor(Math.random() * 10000000)
    cy.request({
      method: 'POST',
      url: 'usuarios',
      headers: {authorization: token},
      body:{
        "nome": "Mariah torres",
        "email": "beltrano@qa.com.br",
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
      
    }).then((response)=> {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')

    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
   cy.request('usuarios').then(response => {
    let id = response.body.usuarios[6]._id
    cy.request({
      method:'PUT',
      url: `usuarios/${id}`,
      headers: {authorization: token},
      body:{
        "nome": "gilsinhho",
        "email": "gilsonqa@ebac.com",
        "password": "teste020",
        "administrador": "true"
      }
    }).then((response)=> {
      expect(response.body.message).to.equal('Registro alterado com sucesso')
    })
   })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then(response => {
     let id = response.body.usuarios[5]._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
        headers: {authorization: token},
        body:{
          "nome": "Gustavo Silva",
          "email": "beltrano@qa.com.br",
          "password": "teste",
          "administrador": "true"
        }
      }).should(resp => {
        expect(resp.body.message).to.equal('Registro excluído com sucesso')
        expect(resp.status).to.equal(200)
    })
    })
  });


});
