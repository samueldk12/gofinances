import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      try{
        const response_transactions = await api.get('/transactions');
        
        const balance_values : Balance = response_transactions.data.balance;
       
        setBalance(balance_values);

        const transactions_values : Transaction[] = response_transactions.data.transactions;

        setTransactions(transactions_values);
      }catch(err){
        console.log(err);
      }
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header/>
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>
                Entradas
              </p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
             {
                balance.income ?
                formatValue(balance.income) :
                0
             }
             </h1>
          </Card>
          <Card>
            <header>
              <p>
                Saídas
              </p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome"> 
            {
                balance.outcome ?
                formatValue(balance.outcome) :
                0
            }
            </h1>
          </Card>
          <Card total>
            <header>
              <p>
                Total
              </p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">  
            {
                balance.total ?
                formatValue(balance.total) :
                0
            }
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
          
                { transactions && 
                  transactions.map( transaction => {
                    let data_transaction = transaction.created_at;
                    let value = formatValue(transaction.value);
                    if(transaction.type == 'outcome')
                      value = '- ' + value;

                    return  (   
                        <tr key={transaction.id}>  
                          <td className="title">{transaction.title}</td>
                          <td className={transaction.type}> {value}</td>
                          <td>{transaction.category.title}</td>
                          <td>{data_transaction}</td> 
                        </tr>
                      )
                  }
                )}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
