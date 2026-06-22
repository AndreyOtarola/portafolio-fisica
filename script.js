// Animación al hacer scroll

const cards = document.querySelectorAll(".card");

const mostrar = () =>{

    cards.forEach(card=>{

        const posicion = card.getBoundingClientRect().top;

        const pantalla = window.innerHeight - 100;

        if(posicion < pantalla){

            card.classList.add("mostrar");

        }

    });

}

cards.forEach(card=>{

    card.classList.add("oculto");

});

window.addEventListener("scroll",mostrar);

mostrar();


// Botón volver arriba

const boton = document.createElement("button");

boton.id="topBtn";

boton.innerHTML="↑";

document.body.appendChild(boton);

window.onscroll=()=>{

    if(document.documentElement.scrollTop>300){

        boton.style.display="block";

    }else{

        boton.style.display="none";

    }

}

boton.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}