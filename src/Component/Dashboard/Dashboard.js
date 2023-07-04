import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ID');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
      setSortedUsers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterUsers(e.target.value);
  };

  const filterUsers = (searchTerm) => {
    const filteredUsers = users.filter((user) => {
      const { name, username, email, address, company } = user;
      const { city } = address;
      const searchValue = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(searchValue) ||
        username.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        city.toLowerCase().includes(searchValue) ||
        company.name.toLowerCase().includes(searchValue)
      );
    });
    setSortedUsers(filteredUsers);
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
      if (sortBy === 'ID') {
        return a.id - b.id;
      } else if (sortBy === 'Name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'City') {
        return a.address.city.localeCompare(b.address.city);
      }
      return 0;
    });

    if (sortDirection === 'desc') {
      sortedUsers.reverse();
      setSortDirection('asc');
    } else {
      setSortDirection('desc');
    }

    setSortedUsers(sortedUsers);
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      if (sortDirection === 'asc') {
        return <FontAwesomeIcon icon={faSortUp} />;
      } else {
        return <FontAwesomeIcon icon={faSortDown} />;
      }
    } else {
      return <FontAwesomeIcon icon={faSort} />;
    }
  };

  return (
    <>
        <div className="container">
      <div className='mobile-view'>
      <h2 className="my-4 text-center">User Dashboard</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, username, email, city, or company"
        value={searchTerm}
        onChange={handleSearch}
      />
      </div>
      <div className='tablest'>
      <table className="table table-striped table-responsive">
        <thead>
          <tr className='table-head'>
            <th onClick={() => handleSort('ID')}>
              ID {renderSortIcon('ID')}
            </th>
            <th onClick={() => handleSort('Name')}>
              Name {renderSortIcon('Name')}
            </th>
            <th>Username</th>
            <th>Email</th>
            <th onClick={() => handleSort('City')}>
              City {renderSortIcon('City')}
            </th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address.city}</td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className='text-center'>Total users: {sortedUsers.length}</p>

      
    </div>
    <footer className="footer">
        <div className="footer-text">
          Developed by Kaushal &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
