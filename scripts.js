//Seleciona os elementos do formulario
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");


// Seleciona os elementos da lista. 
const expenseList = document.querySelector("ul");

// Seleciona os elementos totais da lista. 
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// Captura o evento de input para formatar o valor. 
amount.addEventListener("input", (e) => {


  // Obtem o valor atual do input e remove os caracteres nao numericos. 
  let value = amount.value.replace(/\D+/g, "");

  // Transformar o valor em centavos (exemplo: 150/100). 
  value = Number(value / 100);

  // Atualiza o valor do input. 
  amount.value = formatCurrencyBRL(value);

})

function formatCurrencyBRL(value){
  // Formata o valor no padrao BRL (Real Brasileiro) e retorna. 
  return  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};


// Pegando submit do formulario. 
form.addEventListener("submit", (e) => {
  e.preventDefault();


  // Criando um objeto. 
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  }


  // Chama a funcao que ira adicionar o item na lista. 
  expenseAdd(newExpense);

});

// Adiciona um novo item na lista. 
function expenseAdd(newExpense){
  try{

    // Cria o elemento para adicionar o item (li) na lista (ul). 
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);


    // Cria a info da despesa.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa. 
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Cria amount da despesa. 
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Adicionando icone de remover.
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona name e categoria na div das informacoes da despesa. 
    expenseInfo.append(expenseName, expenseCategory);

    // Adiciona as informacoes no item. 
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    

    // Adiciona o item na lista. 
    expenseList.append(expenseItem);
    
    //Limpa os inputs do formulario para adicionar um novo item.
    formClear();

    // Atualizar os valores e contagens de despesas da lista.
    updateTotals();

  }catch(error){
    alert("Nao foi possivel atualizar a lista de despesa");
    console.log(error);
  }
}


// Atualiza os totais. 
function updateTotals(){

  try{
    // Recupera todos os itens (li) da lista (ul). 
    const items = expenseList.children

    // Atualiza a quantidade de itens da lista. 
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "Despesas" : "Despesa"}`;

    // Variavel para incrementar o total. 
    let total = 0;

    for(let i = 0; i < items.length; i++){

      const itemAmount = items[i].querySelector(".expense-amount");

       // Remover caracteres nao numericos e substitui a virgula pelo ponto. 
       let value = itemAmount.textContent.toUpperCase().replace("R$", "").replace(",", ".");


      // convert o valor para float. 
      value = parseFloat(value);


      // Verificar se e um numero valido. 
      if(isNaN(value)){
        return console.log("O conteudo em amount nao e um numero")
      }

      // Incrementar o valor total.
      total += Number(value);

    }

      // Cria a span para adicionar o R$ formatado. 
      const symbolBRL = document.createElement("small");
      symbolBRL.textContent = "R$";
      

      // Formata o valor e remove o R$ que sera exibido pela small com estilo customizado.
      total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

      expensesTotal.innerHTML = "";
      // Adiciona o simbolo da moeda e valor total formatado.
      expensesTotal.append(symbolBRL, total);
  }catch (error){
    console.log(error);d
    alert("Nao foi possivel atualizar os totais");
  }

}

// Evento que captura o clique nos itens da lista. 
expenseList.addEventListener("click", (e) => {
  // Verifica se o elemento clicado e o icone de remover.
  if(e.target.classList.contains("remove-icon")){
    // Obtem a li pai do elemento clicado.
    const item = e.target.closest(".expense");

    // Remove o item da lista. 
    item.remove();
  }

  // Atualiza o valor total
  updateTotals();
})


function formClear(){
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}