import { LightningElement, api } from 'lwc';

export default class CarTile extends LightningElement {

    // This api is required whenever we pass one parameter from lwc to lwc
    @api car={}

    handleClick(){
        this.dispatchEvent(new CustomEvent('selected', {
            detail:this.car.Id
        }))
    }
}