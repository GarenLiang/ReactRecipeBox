'use strict';

// Initial state

var initialState = {
  visibleRecipes: [],
  openRecipe: null,
  recipes: [{
    name: 'Cheese Cake',
    ingredients: ['15 graham crackers crushed', '2 tablespoons butter, melted', '4 (8 ounce) packages cream cheese', '1 1/2 cups white sugar', '3/4 cups milk', '4 eggs', '1 cup sour cream', '1 tablespoon vanilla extract', '1/4 cup all purpose-flour']
  }, {
    name: 'Pizza Dough',
    ingredients: ['1 (25 ounce) envelope active dry yeast', '1 cup lukewarm water', '3 cups all-purpose flour', '1/4 teaspoon salt', '2 tablespoons shortening']
  }, {
    name: 'Pizza Sauce',
    ingredients: ['1 tablespoon vegetable oil', '1/2 cup chopped onion', '1 (6 ounce) can tomato paste', '6 fluid ounces water', '1/2 teaspoon white sugar', '1 teaspoon salt', '1/8 teaspoon ground black pepper', '1/4 teaspoon garlic powder', '1/4 teaspoon dried basil', '1/2 teaspoon dried oregano', '1/4 teaspoon dried marjoram', '1/4 teaspoon dried cumin', '1/4 teaspoon chili powder', '1/8 teaspoon crushed red pepper flakes']
  }]
};

// Load and save state to local storage
// IMPELEMENT THIS INOT APP LAST

var loadState = function loadState() {
  try {
    var serializedState = localStorage.getItem('state');
    if (serializedState === null) return undefined;else return JSON.parse(serializedState);
  } catch (err) {
    console.log('Failed to load the state from local storage.');
    console.error(err);
    return undefined;
  }
};

var saveState = function saveState(state) {
  try {
    var serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.log('Failed to save the state to local storage.');
    console.error(err);
  }
};

// Action creators sorted by reducer

var toggleRecipeVisibility = function toggleRecipeVisibility(recipe) {
  return { type: 'TOGGLE_RECIPE',
    recipe: recipe };
};
var _removeVisibility = function _removeVisibility(name) {
  return { type: 'REMOVE_VISIBILITY', name: name };
};

var _openNewRecipe = function _openNewRecipe() {
  return { type: 'OPEN_NEW_RECIPE' };
};
var openRecipeForEdit = function openRecipeForEdit(recipe) {
  return { type: 'OPEN_RECIPE_FOR_EDIT',
    recipe: recipe };
};
var _editName = function _editName(name) {
  return { type: 'EDIT_NAME',
    name: name };
};
var _editIngredient = function _editIngredient(ingredient) {
  return { type: 'EDIT_INGREDIENT',
    ingredient: ingredient };
};
var _addIngredient = function _addIngredient() {
  return { type: 'ADD_INGREDIENT' };
};
var _deleteIngredient = function _deleteIngredient(index) {
  return { type: 'DELETE_INGREDIENT',
    index: index };
};
var closeEditWindow = function closeEditWindow() {
  return { type: 'CLOSE_EDIT_WINDOW' };
};

var _saveRecipe = function _saveRecipe(recipe) {
  return { type: 'SAVE_RECIPE',
    recipe: recipe };
};
var _deleteRecipe = function _deleteRecipe(index) {
  return { type: 'DELETE_RECIPE',
    index: index };
};

// Reducers

var visibleRecipes = function visibleRecipes() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var action = arguments[1];

  var index = undefined;
  switch (action.type) {
    case 'TOGGLE_RECIPE':
      index = state.indexOf(action.recipe.name);
      if (index === -1) state.push(action.recipe.name);else state.splice(index, 1);
      return state;
    case 'REMOVE_VISIBILITY':
      index = state.indexOf(action.name);
      if (index !== -1) state.splice(index, 1);
      return state;
    default:
      return state;
  }
};

var openRecipe = function openRecipe() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'OPEN_NEW_RECIPE':
      return { name: '', ingredients: [], newIngredient: '' };
    case 'OPEN_RECIPE_FOR_EDIT':
      return { name: '' + action.recipe.name,
        ingredients: [].concat(action.recipe.ingredients),
        newIngredient: '' };
    case 'EDIT_NAME':
      return Object.assign({}, state, {
        name: action.name
      });
    case 'ADD_INGREDIENT':
      if (state.newIngredient !== "") state.ingredients.push(state.newIngredient);
      return Object.assign({}, state, { newIngredient: '' });
    case 'EDIT_INGREDIENT':
      return Object.assign({}, state, {
        newIngredient: action.ingredient
      });
    case 'DELETE_INGREDIENT':
      state.ingredients.splice(action.index, 1);
      return state;
    case 'CLOSE_EDIT_WINDOW':
      return null;
    default:
      return state;
  }
};

var recipes = function recipes() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState.recipes : arguments[0];
  var action = arguments[1];

  var index = undefined;
  switch (action.type) {
    case 'SAVE_RECIPE':
      var names = state.map(function (recipe) {
        return recipe.name;
      });
      index = names.indexOf(action.recipe.name);
      if (index === -1) {
        state.push(action.recipe);
        return state;
      } else {
        state[index] = action.recipe;
        return state;
      }
    case 'DELETE_RECIPE':
      state.splice(action.index, 1);
      return state;
    default:
      return state;
  }
};

var rootReducer = Redux.combineReducers({ visibleRecipes: visibleRecipes,
  openRecipe: openRecipe,
  recipes: recipes });

// Store
var store = Redux.createStore(rootReducer, loadState());

var then = Date.now();

store.subscribe(function () {
  console.log(store.getState());
  renderApp();

  saveState({ recipes: store.getState().recipes });
});

// React components

// Presentational

var Recipe = function Recipe(_ref) {
  var index = _ref.index;
  var visibleRecipes = _ref.visibleRecipes;
  var recipe = _ref.recipe;
  var toggle = _ref.toggle;
  var openRecipe = _ref.openRecipe;
  var deleteRecipe = _ref.deleteRecipe;
  var removeVisibility = _ref.removeVisibility;

  var visibility = undefined;
  var element = undefined;
  if (visibleRecipes.indexOf(recipe.name) !== -1) {
    visibility = 'recipe-visible';
    element = React.createElement('i', { className: 'fa fa-angle-down' });
  } else {
    visibility = 'recipe-hidden';
    element = React.createElement('i', { className: 'fa fa-angle-right' });
  }

  return React.createElement(
    'div',
    { className: 'recipe-container' },
    React.createElement(
      'div',
      { className: 'recipe-name',
        onClick: function onClick(ev) {
          ev.preventDefault();toggle(recipe);
        } },
      element,
      ' ' + recipe.name
    ),
    React.createElement(
      'div',
      { className: 'recipe ' + visibility },
      React.createElement(
        'ul',
        null,
        recipe.ingredients.map(function (ingredient) {
          return React.createElement(
            'li',
            { className: 'ingredient' },
            ingredient
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'recipe-btns-container' },
        React.createElement(
          'button',
          { className: 'btn edit-btn',
            onClick: function onClick(ev) {
              ev.preventDefault();openRecipe(recipe);
            } },
          React.createElement('i', { className: 'fa fa-pencil-square-o' }),
          ' Edit'
        ),
        React.createElement(
          'button',
          { className: 'btn delete-btn',
            onClick: function onClick(ev) {
              ev.preventDefault();
              deleteRecipe(index);
              removeVisibility(recipe.name);
            } },
          React.createElement('i', { className: 'fa fa-trash-o' }),
          ' Delete'
        )
      )
    )
  );
};

var Recipes = function Recipes(_ref2) {
  var visibleRecipes = _ref2.visibleRecipes;
  var recipes = _ref2.recipes;
  var toggle = _ref2.toggle;
  var openRecipe = _ref2.openRecipe;
  var deleteRecipe = _ref2.deleteRecipe;
  var openNewRecipe = _ref2.openNewRecipe;
  var removeVisibility = _ref2.removeVisibility;
  return React.createElement(
    'div',
    { classname: 'full-screen-container' },
    React.createElement(
      'div',
      { className: 'recipes-container' },
      React.createElement(
        'div',
        { className: 'recipes-title center-text' },
        'Recipes'
      ),
      recipes.map(function (recipe, index) {
        return React.createElement(Recipe, { index: index,
          visibleRecipes: visibleRecipes,
          recipe: recipe,
          toggle: toggle,
          openRecipe: openRecipe,
          deleteRecipe: deleteRecipe,
          removeVisibility: removeVisibility });
      }),
      React.createElement(
        'button',
        { className: 'btn new-recipe-btn',
          onClick: function onClick(ev) {
            ev.preventDefault();openNewRecipe();
          } },
        React.createElement('i', { className: 'fa fa-plus' }),
        ' Add New Recipe'
      )
    )
  );
};

var Ingredient = function Ingredient(_ref3) {
  var index = _ref3.index;
  var ingredient = _ref3.ingredient;
  var deleteIngredient = _ref3.deleteIngredient;
  return React.createElement(
    'div',
    { className: 'ingredient-container' },
    React.createElement(
      'div',
      { className: 'editor-ingredient' },
      React.createElement('i', { className: 'fa fa-times delete-icon',
        onClick: function onClick(ev) {
          ev.preventDefault();deleteIngredient(index);
        } }),
      React.createElement(
        'div',
        { className: 'editor-ingredient-text' },
        ' ' + ingredient
      )
    )
  );
};

var Editor = function Editor(_ref4) {
  var openRecipe = _ref4.openRecipe;
  var closeWindow = _ref4.closeWindow;
  var editName = _ref4.editName;
  var addIngredient = _ref4.addIngredient;
  var editIngredient = _ref4.editIngredient;
  var deleteIngredient = _ref4.deleteIngredient;
  var saveRecipe = _ref4.saveRecipe;

  var containerClass = !openRecipe ? 'editor-bg-hidden' : 'editor-bg';
  var editorClass = !openRecipe ? 'editor-container-hidden' : 'editor-container';

  return React.createElement(
    'div',
    { className: "full-screen-container " + containerClass },
    React.createElement(
      'div',
      { className: editorClass },
      React.createElement(
        'div',
        { className: 'exit-btn-container' },
        React.createElement('i', { className: 'fa fa-times exit-btn-icon',
          onClick: function onClick(ev) {
            ev.preventDefault();closeWindow();
          } })
      ),
      React.createElement(
        'div',
        { className: 'editor-title center-text' },
        React.createElement('i', { className: 'fa fa-pencil-square-o' }),
        ' Edit Recipe'
      ),
      React.createElement(
        'div',
        { className: 'editor-section-title' },
        'Recipe Name:'
      ),
      React.createElement(
        'div',
        { className: 'name-input-container' },
        React.createElement('input', { className: 'name-input',
          value: openRecipe ? openRecipe.name : null,
          onChange: function onChange(ev) {
            ev.preventDefault();editName(ev.target.value);
          } })
      ),
      React.createElement(
        'div',
        { className: 'editor-section-title' },
        openRecipe && openRecipe.ingredients.length ? 'Ingredients:' : ''
      ),
      !openRecipe ? null : openRecipe.ingredients.map(function (ingredient, index) {
        return React.createElement(Ingredient, { index: index,
          ingredient: ingredient,
          deleteIngredient: deleteIngredient });
      }),
      React.createElement(
        'div',
        { className: 'editor-section-title' },
        'Add Ingredient:'
      ),
      React.createElement(
        'div',
        { className: 'add-ingredient-container' },
        React.createElement('i', { className: 'fa fa-plus add-icon',
          onClick: function onClick(ev) {
            ev.preventDefault();addIngredient();
          } }),
        React.createElement('input', { className: 'add-ingredient-input',
          value: !openRecipe ? null : openRecipe.newIngredient,
          onChange: function onChange(ev) {
            ev.preventDefault();editIngredient(ev.target.value);
          } })
      ),
      React.createElement(
        'button',
        { className: 'btn save-recipe-btn',
          disabled: openRecipe ? !openRecipe.ingredients.length || !openRecipe.name.length : true,
          onClick: function onClick(ev) {
            ev.preventDefault();
            saveRecipe({ name: openRecipe.name, ingredients: openRecipe.ingredients });
            closeWindow();
          } },
        React.createElement('i', { className: 'fa fa-floppy-o' }),
        ' Save Recipe'
      )
    )
  );
};

// Containers

var mapRecipesStateTopProps = function mapRecipesStateTopProps(state, ownProps) {
  return {
    visibleRecipes: state.visibleRecipes,
    recipes: state.recipes
  };
};
var mapDispatchToRecipes = function mapDispatchToRecipes(dispatch, ownProps) {
  return {
    toggle: function toggle(recipe) {
      return dispatch(toggleRecipeVisibility(recipe));
    },
    openRecipe: function openRecipe(recipe) {
      return dispatch(openRecipeForEdit(recipe));
    },
    deleteRecipe: function deleteRecipe(index) {
      return dispatch(_deleteRecipe(index));
    },
    openNewRecipe: function openNewRecipe() {
      return dispatch(_openNewRecipe());
    },
    removeVisibility: function removeVisibility(name) {
      return dispatch(_removeVisibility(name));
    }
  };
};
var RecipesDisplay = ReactRedux.connect(mapRecipesStateTopProps, mapDispatchToRecipes)(Recipes);

var mapEditorStateToProps = function mapEditorStateToProps(state, ownProps) {
  return { openRecipe: state.openRecipe };
};
var mapDispatchToEditor = function mapDispatchToEditor(dispatch, ownProps) {
  return {
    closeWindow: function closeWindow() {
      return dispatch(closeEditWindow());
    },
    editName: function editName(name) {
      return dispatch(_editName(name));
    },
    addIngredient: function addIngredient() {
      return dispatch(_addIngredient());
    },
    editIngredient: function editIngredient(ingredient) {
      return dispatch(_editIngredient(ingredient));
    },
    deleteIngredient: function deleteIngredient(index) {
      return dispatch(_deleteIngredient(index));
    },
    saveRecipe: function saveRecipe(recipe) {
      return dispatch(_saveRecipe(recipe));
    }
  };
};
var RecipeEditor = ReactRedux.connect(mapEditorStateToProps, mapDispatchToEditor)(Editor);

// Main app

var App = function App() {
  return React.createElement(
    'div',
    { className: 'full-screen-container' },
    React.createElement(RecipesDisplay, null),
    React.createElement(
      'div',
      { className: 'center-text signature' },

      React.createElement('i', { className: 'fa fa-heart' }),
      ' by Garen'
    ),
    React.createElement(RecipeEditor, null)
  );
};

// Main render call

function renderApp() {
  ReactDOM.render(React.createElement(
    ReactRedux.Provider,
    { store: store },
    React.createElement(App, null)
  ), document.getElementById('root'));
}
window.onresize = renderApp;
window.onorientationchange = renderApp;
renderApp();
