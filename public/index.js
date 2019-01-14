'use strict';

//list of bars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
	'deductibleReduction': false
  },
  'price': 0,
  'commission': {
	'insurance': 0,
	'treasury': 0,
	'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
	'deductibleReduction': true
  },
  'price': 0,
  'commission': {
	'insurance': 0,
	'treasury': 0,
	'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
	'deductibleReduction': true
  },
  'price': 0,
  'commission': {
	'insurance': 0,
	'treasury': 0,
	'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
	'who': 'booker',
	'type': 'debit',
	'amount': 0
  }, {
	'who': 'bar',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'insurance',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'treasury',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'privateaser',
	'type': 'credit',
	'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
	'who': 'booker',
	'type': 'debit',
	'amount': 0
  }, {
	'who': 'bar',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'insurance',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'treasury',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'privateaser',
	'type': 'credit',
	'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
	'who': 'booker',
	'type': 'debit',
	'amount': 0
  }, {
	'who': 'bar',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'insurance',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'treasury',
	'type': 'credit',
	'amount': 0
  }, {
	'who': 'privateaser',
	'type': 'credit',
	'amount': 0
  }]
}];

//Step 1 - Computing the booking price for each booker according to the events
/*for (var i = 0; i < events.length; i++) {
  var persons = events[i].persons;
  var time = events[i].time;
  var barId = events[i].barId;
  var pricePerPerson;
  var pricePerHour;
  for (var j = 0; j < bars.length; j++){
    if(bars[i].id == barId){
      if(persons > 10 && persons <= 20)
      pricePerPerson = bars[i].pricePerPerson;
      pricePerHour = bars[i].pricePerHour;
      break;
    }
  }
  //we directly change the value of the price in the events array
  events[i].price = (persons*pricePerPerson + time*pricePerHour);
}*/

//This constant function gets the bar whose id equals the input id
const getBar = id => {
return bars.find(bar => bar.id ===id);
}
//Step 2 - Adding the new decrease pricing rules based on the number of persons
//Step 3 - Adding the commission calculation
//Step 4 - Adding the deductible option effect on pricing and commission
events.forEach(function (event){
  //Step1:
  const persons = event.persons;
  const time = event.time;
  const barId = event.barId;
  const bar = getBar(barId);
  var pricePerPerson = bar.pricePerPerson;
  var pricePerHour = bar.pricePerHour;
  //Step2:
  if(persons > 10 && persons <=20){
    pricePerPerson -= pricePerPerson*0.1;//decrease by 10% if more than 10 people
  }
  if(persons >20 && persons <=60){
    pricePerPerson -= pricePerPerson*0.3;//decrease by 30% if more than 20 people
  }
  if(persons > 60){
    pricePerPerson -= pricePerPerson*0.5;//decrease by 50% if more than 60 people
  }
  event.price = time*pricePerHour + persons*pricePerPerson;
  //Step3:
  const commission = event.price*0.3;//30% of the booking price
  event.commission.insurance = commission*0.5;//half of the commission goes to insurance
  event.commission.treasury = persons;//1 euro per person goes to treasury
  event.commission.privateaser = commission*0.5 - persons;//the rest for privateaser
  //Step4:
  if(event.options.deductibleReduction){
    event.price += persons;//1 euro per person added to the booking price
    event.commission.privateaser += persons;//this charge goes directly to privateaser
  }
})
//Step 5 - Paying and Crediting the Actors
//This function helps getting the events whose id we have
const getEvent = id => {
return events.find(event => event.id ===id);
}
actors.forEach(function (actor){
  const eventId = actor.eventId;
  const event = getEvent(eventId);
  actor.payment.forEach(function (paymentActor){
    if(paymentActor.who == 'booker') paymentActor.amount += event.price;
    if(paymentActor.who == 'bar') paymentActor.amount += event.price - event.commission.insurance - event.commission.treasury - event.commission.privateaser;
    if(paymentActor.who == 'insurance') paymentActor.amount += event.commission.insurance;
    if(paymentActor.who == 'treasury') paymentActor.amount += event.commission.treasury;
    if(paymentActor.who == 'privateaser') paymentActor.amount += event.commission.privateaser;
  })
})
console.log(bars)
console.log(events);
console.log(actors);
