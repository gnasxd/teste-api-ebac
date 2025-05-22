/// <reference types= "cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let token
  beforeEach(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => {
      token = tkn
    })
  
  });

  it('Deve validar contrato de usuários', () => {
    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.usuarios)
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

  it('Deve cadastrar um usuário com sucesso', () => {
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
        "nome": usuario,
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
    let usuario = ' Usuario EBAC editado ' + Math.floor(Math.random() * 10000000)
     let email = 'ebac' + Math.floor(Math.random() * 10000000) + '@teste.com'
      let senha = 'teste123'
    cy.cadastrarUsuario(token, usuario, email, senha, 'true')
    .then(response => {
    let id = response.body._id
    cy.request({
      method:'PUT',
      url: `usuarios/${id}`,
      headers: {authorization: token},
      body:{
        "nome": usuario,
        "email": email,
        "password": senha,
        "administrador": "true"
      }
    }).should((response)=> {
      expect(response.body.message).to.equal('Registro alterado com sucesso')
      expect(response.status).to.equal(200)
    })
   })
  });

  it.only('Deve deletar um usuário previamente cadastrado', () => {
    let usuario = ' Usuario EBAC deletado ' + Math.floor(Math.random() * 10000000)
    let email = 'ebac' + Math.floor(Math.random() * 10000000) + '@teste.com'
     let senha = 'teste123'
     cy.cadastrarUsuario(token, usuario, email, senha, 'true')
   .then(response => {
    let id = response.body._id  
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
        headers: {authorization: token},
        body:{
          "nome": usuario,
          "email": email,
          "password":senha,
          "administrador": "true"
        }
      }).should(resp => {
        expect(resp.body.message).to.equal('Registro excluído com sucesso')
        expect(resp.status).to.equal(200)
    })
    })
  });
});
