import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios'

import { TarefasToolbar, TarefasTable } from './components';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'


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

const TarefasLista = () => { //componente principal (componente funcional) 
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const salvar = (tarefa) => {
    axios.post(API_URL, tarefa, {
      headers: HEADERS
    }).then(response => {
      const novaTarefa = response.data
      setTarefas([...tarefas, novaTarefa])
      setMensagem(`Item adicionado com sucesso!`)
      setOpenDialog(true)
    }).catch(error => {
      setMensagem(`Ocorreu um Erro... ${error}`)
      setOpenDialog(true)
    })
  }

  const listarTarefas = () => {
    axios.get(API_URL, {
      headers: HEADERS
    }).then(response => {
      const listaTarefas = response.data
      setTarefas(listaTarefas)
    }).catch(error => {
      setMensagem(`Ocorreu um Erro... ${error}`)
      setOpenDialog(true)
    })
  }

  const alterarStatus = (id) => {
    axios.patch(`${API_URL}/${id}`, null, { headers: HEADERS })
      .then(response => {
        const lista = [...tarefas]
        lista.forEach(tarefa => {
          if (tarefa.id === id) {
            tarefa.done = true
          }
        })
        setTarefas(lista)
        setMensagem(`A tarefa com id ${id} foi alterada com sucesso!`)
        setOpenDialog(true)
      }).catch(error => {
        setMensagem(`Ocorreu um Erro... ${error}`)
        setOpenDialog(true)
      })
  }

  const deletar = (id) => {
    axios.delete(`${API_URL}/${id}`, { headers: HEADERS })
      .then(response => {
        const lista = [...tarefas.filter(tarefa => tarefa.id !== id)]
        setTarefas(lista)
        setMensagem(`A tarefa com id ${id} foi deletada com sucesso!`)
        setOpenDialog(true)
      }).catch(error => {
        setMensagem(`Ocorreu um Erro... ${error}`)
        setOpenDialog(true)
      })
  }

  useEffect(() => {
    listarTarefas()
  }, [])

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable deletar={deletar} alterarStatus={alterarStatus} tarefas={tarefas} />
      </div>

      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default TarefasLista;
