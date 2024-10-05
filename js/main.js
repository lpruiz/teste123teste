"use strict";
const getRandomId = (seed, max, min) => {
    return Math.floor(Math.random() * max) + min - seed;
};
class TodoList {
    tarefas = [];
    observers = [];
    addObserver = (observer) => {
        this.observers.push(observer);
    };
    notifyObservers = () => {
        this.observers.forEach((observer) => observer.update());
    };
    adicionarTarefa = (tarefa) => {
        this.tarefas.push(tarefa);
        this.notifyObservers();
    };
    removerTarefa = (tarefa) => {
        const index = this.tarefas.indexOf(tarefa);
        if (index !== -1) {
            this.tarefas.splice(index, 1);
            this.notifyObservers();
        }
    };
    editarTarefa = (idTarefa, fieldstarefa) => {
        this.tarefas = this.tarefas.map((t) => {
            if (idTarefa === t.id) {
                return {
                    ...t, ...fieldstarefa
                };
            }
            return t;
        });
        this.notifyObservers();
    };
}
class TodoListObserver {
    update() {
        renderizarTarefas();
    }
}
const tarefaContainer = (tarefa) => {
    const element = document.createElement("div");
    element.classList.add("todo");
    element.setAttribute("tarefa-id", `${tarefa.id}`);
    element.innerHTML = `<h3><strong>${tarefa.nome}</strong> <br> <br> 
   ${tarefa.dataLimite.toLocaleDateString()} - ${tarefa.dataLimite.toLocaleTimeString()}</h3> `;
    const botaoEditar = document.createElement("button");
    botaoEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
    botaoEditar.classList.add("edit-todo");
    botaoEditar.setAttribute("data-bs-toggle", "modal");
    botaoEditar.setAttribute("data-bs-target", "#modalAtualizarTarefa");
    botaoEditar.addEventListener("click", editarTarefa);
    const botaoDeletar = document.createElement("button");
    botaoDeletar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    botaoDeletar.classList.add("remove-todo");
    botaoDeletar.addEventListener("click", removerTarefa);
    const botaoConcluir = document.createElement("button");
    botaoConcluir.innerHTML = '<i class="fa-solid fa-check"></i>';
    botaoConcluir.addEventListener("click", concluirTarefa);
    element.appendChild(botaoConcluir);
    element.appendChild(botaoEditar);
    element.appendChild(botaoDeletar);
    return element;
};
const renderizarTarefas = () => {
    const todoDiv = document.querySelector("#todo-list");
    todoDiv.innerHTML = "";
    todoList.tarefas.forEach((tarefa) => {
        todoDiv.appendChild(tarefaContainer(tarefa));
    });
    console.log(todoList.tarefas);
};
const todoListObserver = new TodoListObserver();
const todoList = new TodoList();
todoList.tarefas = [];
todoList.addObserver(todoListObserver);
const criarTarefa = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const inputNome = document.querySelector("input#todo-input");
    const inputData = document.querySelector("input#data");
    if (inputNome.value !== "" && inputData.value !== "") {
        const novaTarefa = {
            id: getRandomId(getRandomId(5, 2000, 10), 10000, 2000),
            nome: inputNome.value,
            dataLimite: new Date(inputData.value.replace('T', ' ').replace('-', '/'))
        };
        todoList.adicionarTarefa(novaTarefa);
        inputData.value = "";
        inputNome.value = "";
    }
};
const editarTarefa = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tarefaDiv = e.target;
    const inputNomeUpdate = document.querySelector("input#nome-update");
    const inputDataUpdate = document.querySelector("input#data-update");
    const botaoConfirmar = document.querySelector("button#btn-editar");
    const tarefa = todoList.tarefas.find(tarefa => `${tarefa.id}` === tarefaDiv.parentElement?.getAttribute("tarefa-id"));
    inputNomeUpdate.value = tarefa?.nome;
    inputDataUpdate.value = tarefa?.dataLimite.toISOString().slice(0, 16);
    botaoConfirmar.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (inputNomeUpdate.value !== "" && inputDataUpdate.value !== "") {
            todoList.editarTarefa(tarefa.id, {
                nome: inputNomeUpdate.value,
                dataLimite: new Date(inputDataUpdate.value),
            });
        }
    });
};
const removerTarefa = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.target;
    const tarefa = todoList.tarefas.find(tarefa => `${tarefa.id}` === button.parentElement?.getAttribute("tarefa-id"));
    if (tarefa) {
        todoList.removerTarefa(tarefa);
    }
};
const concluirTarefa = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.target;
    const divPai = button.parentElement;
    if (!divPai.classList.contains("done")) {
        divPai.classList.add("done");
    }
    else {
        divPai.classList.remove("done");
    }
};
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
    switch (filterValue) {
        case "all":
            todos.forEach((todo) => {
                if (todo instanceof HTMLElement)
                    todo.style.display = "flex";
            });
            break;
        case "done":
            todos.forEach((todo) => {
                if (todo instanceof HTMLElement)
                    todo.classList.contains("done")
                        ? (todo.style.display = "flex")
                        : (todo.style.display = "none");
            });
            break;
        case "todo":
            todos.forEach((todo) => {
                if (todo instanceof HTMLElement)
                    !todo.classList.contains("done")
                        ? (todo.style.display = "flex")
                        : (todo.style.display = "none");
            });
            break;
        default:
            break;
    }
};
const filterBtn = document.querySelector("#filter-select");
filterBtn?.addEventListener("change", (e) => {
    const filter = e.target;
    filterTodos(filter.value);
});
const buttonCreate = document.querySelector("#todo-form > button");
buttonCreate.addEventListener("click", criarTarefa);
