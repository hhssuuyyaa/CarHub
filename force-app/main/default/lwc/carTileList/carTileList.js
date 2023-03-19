import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';

// Lightning Message Service and a message channel
import {publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';

export default class CarTileList extends LightningElement {

    cars=[]
    errors
    filters = {};
    carFilterSubscription

    @wire(getCars, {filters:'$filters'})
    carsHandler({data,error}){
        if(data){
            console.log(data)
            this.cars = data;
        }else{
            console.error(error)
            this.errors = error;
        }
    }

    /** Load context for LMS */
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscibeHandler();
    }

    subscibeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext,CARS_FILTERED_MESSAGE, (message)=>this.handleFilterChanges(message)) 
    }

    handleFilterChanges(message){
        console.log(message.filters);
        this.filters = {...message.filters};
    }

    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }

    handleCarSelected(event){
        console.log()
        publish(this.messageContext, CARS_SELECTED_MESSAGE, {
            carId:event.detail
        })
    }

}