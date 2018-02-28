var Panel = ReactBootstrap.Panel, Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button, Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup,ListGroupItem = ReactBootstrap.ListGroupItem;

import React from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrap from 'react-bootstrap';

var recipes = (typeof localStorage["recipeBox"] != "undefined") ? JSON.parse(localStorage["recipeBook"]) : [
  {title: "Pumpkin Pie", ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]}, 
  {title: "Spaghetti", ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]}, 
  {title: "Onion Pie", ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"]}
], globalTitle = "", globalIngredients = [];

// RecipeBox class. 모든 레시피를 담고 있다.
var RecipeBox = React.createClass ({
  render: function() {
    return (
      <div>
        <Accordion>
          {this.props.data}
        </Accordion>
      </div>
    );
  }
});

// Recipe class. RecipeBox에 있는 레시피들을 보여준다.
var Recipe = React.createClass ({
  delete: function() {
    recipes.splice(this.props.index, 1);
    update();
  },
  edit: function() {
    globalTitle = this.props.title;
    globalIngredients = this.props.ingredients;
    document.getElementById("show").click();  // edit을 눌렀을 때 modal창이 열리게 함
  },
  render: function() {
    return (
      <div>
        <h4 className="text-center">Ingredients</h4><br/>
        <IngredientList ingredients={this.props.ingredients} />
        <ButtonToolbar>
          <Button class="delete" id={"btn-del"+this.props.index} onClick={this.delete}>Delete</Button>
          <Button class="edit" id={"btn-edit"+this.props.index} onClick={this.edit}>Edit</Button>
        </ButtonToolbar>
      </div>
    );
  }
});

// IngredientList class. 레시피의 모든 재료들의 리스트
var IngredientList = React.createClass ({
  render: function() {
    var ingredientList = this.props.ingredients.map(function(ingredient) {
      return (
        <ListGroupItem>
          {ingredient}
        </ListGroupItem>
      );
    });
    return (
      <ListGroup>
        {ingredientList}
      </ListGroup>
    );
  }
});

// RecipeAdd class. 모달 박스와 Add Recipe 버튼을 포함한다.
var RecipeAdd = React.createClass ({
  getInitialState: function() {
    return { showModal: false };
  },
  close: function() {
    globalTitle = "";
    globalIngredients = [];
    this.setState({ showModal: false });
  },
  open: function() {
    this.setState({ showModal: true });
    if (document.getElementById("title") && document.getElementById("ingredients")) {  // 이미 값이 있다면
      $("#title").val(globalTitle); // title의 값을 globalTitle에 저장
      $("#ingredients").val(globalIngredients); // ingredients의 값을 globalIngredients에 저장
      if(globalTitle != "") {  // globalTitle이 이미 존재한다면 - add가 아니라 edit이라면
        $("#modalTitle").text("Edit Recipe");
        $("#addButton").text("Edit Recipe");
      }
    }
    else requestAnimationFrame(this.open);
  },
  add: function() {
    var title = document.getElementById("title").value; // title로 입력받은 값을 title 변수에 저장
    var ingredients = document.getElementById("ingredients").value.split(","); // ingredients로 입력받은 값을 ingredients 변수에 저장
    var exist = false;
    for (var i = 0; i < recipes.length; i++) {
      if (recipes[i].title === title) { // 기존의 레시피 title과 중복될 경우
        recipes[i].ingredients = ingredients; // 현재의 것으로 대체한다.
        exist = true;
        break; // update()로 바로 건너뜀
      }
    }
    if(!exist) {
      if(title.length < 1) {
        title = "Untitled";
      }
      recipes.push({title: title, ingredients: document.getElementById("ingredients").value.split(",")});
    }
    update();
    this.close();
  },
  
  //id="show" -> Add Recipe와 Edit 버튼은 내용을 공유함
  //Modal 제목 옆에 close 버튼 추가 - Button onClick
  //방금 open되었으니 showModal의 상태는 true - Modal show
  //Modal 제목 옆에 close 버튼 추가 - Modal.Header
  render: function() {
    return (
      <div>
        <Button onClick={this.open} id="show">Add Recipe</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Add a new Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <Input type="text" label="Recipe" placeholder="Recipe Name" id="title" />
              <Input type="textarea" label="Ingredients" placeholder="Enter Ingredients,Separated,By Commas" id="ingredients" />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.add} id="addButton">Add Recipe</Button>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

// 모든 레시피들을 보여주기 위한 업데이트 함수
function update() {
  localStorage.setItem("recipeBox", JSON.stringify(recipes));
  var rows = [];
  for (var i = 0; i < recipes.length; i++) {
    rows.push(
      <Panel header={recipes[i].title} eventKey={i}>
        <Recipe title={recipes[i].title} ingredients={recipes[i].ingredients} index={i} />
      </Panel>
    );
  }
  ReactDOM.render(<RecipeBox data={rows} />, document.getElementById("container"));
}

// Add 버튼과 Modal을 보여줌
ReactDOM.render(<RecipeAdd />, document.getElementById("button"));
update();
