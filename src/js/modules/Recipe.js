import axios from 'axios';
import {
    key,
    proxy
} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.publisher = res.data.recipe.publisher;
            this.source = res.data.recipe.source_url;

        } catch (err) {
            console.log(err);
            alert("Something went wrong :(");
        }
    }
    calcTime() {
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 10;
    }
    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitLong = ['teaspoons', 'cups', 'tablespoons', 'ounces', 'pounds'];
        const unitShort = ['teaspoon', 'cup', 'tablespoon', 'ounce', 'pound'];
        const units = [...unitShort, 'kg', 'g', 'gm'];

        //Uniform units
        let newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitLong.forEach((data, i) => {
                ingredient = ingredient.replace(data, unitShort[i]);
            });
            //Remove parantheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            //Parse ingredients into count, unit, ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            let objIng;

            if (unitIndex > -1) {
                //There is a unit
                let count;
                const arrCount = arrIng.slice(0, unitIndex);
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: unitIndex,
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                //There is no unit but 1st position is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                //There is no unit and no number at 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    };
    updateServings(type) {
        //Servings
        let newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= newServings / this.servings;
        });
        this.servings = newServings;
    }
}