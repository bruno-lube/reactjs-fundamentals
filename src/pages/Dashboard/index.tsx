import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';
import formatDate from '../../utils/formatDate';

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
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('transactions');

      if (response?.data?.transactions?.length > 0) {
        const { transactions: _transactions, balance: _balance } = response.data;

        const formattedTransactions = _transactions.map((trans: Transaction) => ({
          ...trans,
          formattedValue : trans.type === "outcome" ? ` - ${formatValue(trans.value)}` : formatValue(trans.value),
          formattedDate : formatDate(trans.created_at)
        }));
        setTransactions(formattedTransactions);

        setBalance({
          income: formatValue(_balance.income),
          outcome: formatValue(_balance.outcome),
          total: formatValue(_balance.total),
        });
}
    }

loadTransactions();
  }, []);

return (
  <>
    <Header />
    <Container>
      <CardContainer>
        <Card>
          <header>
            <p>Entradas</p>
            <img src={income} alt="Income" />
          </header>
          <h1 data-testid="balance-income">{balance.income}</h1>
        </Card>
        <Card>
          <header>
            <p>Saídas</p>
            <img src={outcome} alt="Outcome" />
          </header>
          <h1 data-testid="balance-outcome">
            {balance.outcome}
          </h1>
        </Card>
        <Card total>
          <header>
            <p>Total</p>
            <img src={total} alt="Total" />
          </header>
          <h1 data-testid="balance-total">{balance.total}</h1>
        </Card>
      </CardContainer>

      {transactions && (
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
              {transactions.map(trans => (
                <tr key={trans.id}>
                  <td className="title">{trans.title}</td>
                  <td className={trans.type}>{trans.formattedValue}</td>
                  <td>{trans.category.title}</td>
                  <td>{trans.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}
    </Container>
  </>
);
};

export default Dashboard;
