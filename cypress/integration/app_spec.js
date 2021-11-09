// type definitions for Cypress object "cy"
/// <reference types="cypress" />

// type definitions for custom commands like "createDefaultTodos"
/// <reference types="../support" />

// check this file using TypeScript if available
// @ts-check

// ***********************************************
// All of these tests are written to implement
// the official TodoMVC tests written for Selenium.
//
// The Cypress tests cover the exact same functionality,
// and match the same test names as TodoMVC.
// Please read our getting started guide
// https://on.cypress.io/introduction-to-cypress
//
// You can find the original TodoMVC tests here:
// https://github.com/tastejs/todomvc/blob/master/tests/test.js
// ***********************************************

describe("TodoMVC - React", function () {
  // setup these constants to match what TodoMVC does
  let TODO_ITEM_ONE = "buy some cheese";
  let TODO_ITEM_TWO = "feed the cat";
  let TODO_ITEM_THREE = "book a doctors appointment";

  beforeEach(function () {
    // By default Cypress will automatically
    // clear the Local Storage prior to each
    // test which ensures no todos carry over
    // between tests.
    //
    // Go out and visit our local web server
    // before each test, which serves us the
    // TodoMVC App we want to test against
    //
    // We've set our baseUrl to be http://localhost:8888
    // which is automatically prepended to cy.visit
    //
    // https://on.cypress.io/api/visit
    cy.visit("/");
  });

  afterEach(() => {
    // In firefox, blur handlers will fire upon navigation if there is an activeElement.
    // Since todos are updated on blur after editing,
    // this is needed to blur activeElement after each test to prevent state leakage between tests.
    cy.window().then((win) => {
      // @ts-ignore
      win.document.activeElement.blur();
    });
  });

  // a very simple example helpful during presentations
  it("adds 2 todos", function () {
    cy.get(".new-todo").type("learn testing{enter}").type("be cool{enter}");

    cy.get(".todo-list li").should("have.length", 2);
  });

  context("When page is initially opened", function () {
    it("should focus on the todo input field", function () {
      // get the currently focused element and assert
      // that it has class='new-todo'
      //
      // http://on.cypress.io/focused
      cy.focused().should("have.class", "new-todo");
    });
  });

  context("No Todos", function () {
    it("should hide #main and #footer", function () {
      // Unlike the TodoMVC tests, we don't need to create
      // a gazillion helper functions which are difficult to
      // parse through. Instead we'll opt to use real selectors
      // so as to make our testing intentions as clear as possible.
      //
      // http://on.cypress.io/get
      cy.get(".todo-list li").should("not.exist");
      cy.get(".main").should("not.exist");
      cy.get(".footer").should("not.exist");
    });
  });

  context("New Todo", function () {
    // New commands used here:
    // https://on.cypress.io/type
    // https://on.cypress.io/eq
    // https://on.cypress.io/find
    // https://on.cypress.io/contains
    // https://on.cypress.io/should
    // https://on.cypress.io/as

    it("should allow me to add todo items", function () {
      // create 1st todo
      cy.get(".new-todo").type(TODO_ITEM_ONE).type("{enter}");

      // make sure the 1st label contains the 1st todo text
      cy.get(".todo-list li")
        .eq(0)
        .find("label")
        .should("contain", TODO_ITEM_ONE);

      // create 2nd todo
      cy.get(".new-todo").type(TODO_ITEM_TWO).type("{enter}");

      // make sure the 2nd label contains the 2nd todo text
      cy.get(".todo-list li")
        .eq(1)
        .find("label")
        .should("contain", TODO_ITEM_TWO);
    });

    it("should clear text input field when an item is added", function () {
      cy.get(".new-todo").type(TODO_ITEM_ONE).type("{enter}");

      cy.get(".new-todo").should("have.text", "");
    });

    // it("should append new items to the bottom of the list", function () {
    //   // this is an example of a custom command
    //   // defined in cypress/support/commands.js
    //   cy.createDefaultTodos().as("todos");

    //   // even though the text content is split across
    //   // multiple <span> and <strong> elements
    //   // `cy.contains` can verify this correctly
    //   cy.get(".todo-count").contains("3 items left");

    //   cy.get("@todos").eq(0).find("label").should("contain", TODO_ITEM_ONE);

    //   cy.get("@todos").eq(1).find("label").should("contain", TODO_ITEM_TWO);

    //   cy.get("@todos").eq(2).find("label").should("contain", TODO_ITEM_THREE);
    // });

    it("should trim text input", function () {
      // this is an example of another custom command
      // since we repeat the todo creation over and over
      // again. It's up to you to decide when to abstract
      // repetitive behavior and roll that up into a custom
      // command vs explicitly writing the code.
      cy.createTodo(`    ${TODO_ITEM_ONE}    `);

      // we use as explicit assertion here about the text instead of
      // using 'contain' so we can specify the exact text of the element
      // does not have any whitespace around it
      cy.get(".todo-list li").eq(0).should("have.text", TODO_ITEM_ONE);
    });

    it("should show #main and #footer when items added", function () {
      cy.createTodo(TODO_ITEM_ONE);
      cy.get(".main").should("be.visible");
      cy.get(".footer").should("be.visible");
    });
  });

  context("Mark all as completed", function () {
    // New commands used here:
    // - cy.check    https://on.cypress.io/api/check
    // - cy.uncheck  https://on.cypress.io/api/uncheck

    beforeEach(function () {
      // This is an example of aliasing
      // within a hook (beforeEach).
      // Aliases will automatically persist
      // between hooks and are available
      // in your tests below
      cy.createDefaultTodos().as("todos");
    });

    it("should allow me to mark all items as completed", function () {
      // complete all todos
      // we use 'check' instead of 'click'
      // because that indicates our intention much clearer
      cy.get(".toggle-all").check();

      // get each todo li and ensure its class is 'completed'
      cy.get("@todos").eq(0).should("have.class", "completed");

      cy.get("@todos").eq(1).should("have.class", "completed");

      cy.get("@todos").eq(2).should("have.class", "completed");
    });

    it("should allow me to clear the complete state of all items", function () {
      // check and then immediately uncheck
      cy.get(".toggle-all").check().uncheck();

      cy.get("@todos").eq(0).should("not.have.class", "completed");

      cy.get("@todos").eq(1).should("not.have.class", "completed");

      cy.get("@todos").eq(2).should("not.have.class", "completed");
    });

    it("complete all checkbox should update state when items are completed / cleared", function () {
      // alias the .toggle-all for reuse later
      cy.get(".toggle-all")
        .as("toggleAll")
        .check()
        // this assertion is silly here IMO but
        // it is what TodoMVC does
        .should("be.checked");

      // alias the first todo and then click it
      cy.get(".todo-list li").eq(0).as("firstTodo").find(".toggle").uncheck();

      // reference the .toggle-all element again
      // and make sure its not checked
      cy.get("@toggleAll").should("not.be.checked");

      // reference the first todo again and now toggle it
      cy.get("@firstTodo").find(".toggle").check();

      // assert the toggle all is checked again
      cy.get("@toggleAll").should("be.checked");
    });
  });
});
