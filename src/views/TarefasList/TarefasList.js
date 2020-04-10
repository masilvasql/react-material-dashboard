import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios'

import { TarefasToolbar, TarefasTable } from './components';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas'
const HEADERS = { 'x-tenant-id': 'teste@email.com' }


const TarefasLista = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);

  const salvar = (tarefa) => {
    axios.post(API_URL, tarefa, {
      headers: HEADERS
    }).then(response => {
      const novaTarefa = response.data
      setTarefas([...tarefas, novaTarefa])
    }).catch(error => {
      console.log("falha SALVAR", error)
    })
  }

  const listarTarefas = () => {
    axios.get(API_URL, {
      headers: HEADERS
    }).then(response => {
      const listaTarefas = response.data
      setTarefas(listaTarefas)
    }).catch(error => {
      console.log("falha GET", error)
    })
  }

  const alterarStatus = (id) =>{
    axios.patch(`${API_URL}/${id}`, null, {headers: HEADERS})
    .then(response=>{
        const lista = [...tarefas]
        lista.forEach(tarefa => {
          if(tarefa.id === id){
            tarefa.done = true
          }
        })
        setTarefas(lista)
    }).catch(error => {
      console.log("falha PATCH", error)
    })
  }

  const deletar = (id)=>{
    axios.delete(`${API_URL}/${id}`, {headers:HEADERS})
    .then(response =>{
        const lista = [...tarefas.filter(tarefa => tarefa.id !== id)]
        setTarefas(lista)
    }).catch(error => {
      console.log("falha DELETE", error)
    })
  }

  useEffect(()=>{
    listarTarefas()
  },[])

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable deletar = {deletar} alterarStatus ={alterarStatus} tarefas={tarefas} />
      </div>
    </div>
  );
};

export default TarefasLista;
