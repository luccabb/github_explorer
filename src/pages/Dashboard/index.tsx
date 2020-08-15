import React, {useState, useEffect, FormEvent} from 'react'
import {FiChevronRight} from 'react-icons/fi'
import api from '../../services/api'
import {Link} from 'react-router-dom'

import logoImg from '../../assets/github-logo.svg'

import {Title, Form, Repositories, Error} from './styles'

interface Repository {
    full_name: string,
    description: string,
    owner: {
        login: string, 
        avatar_url: string,
    }

}

const Dashboard: React.FC = () => {
    const [inputError, setInputError] = useState('')
    const [newRepo, setNewRepo] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        const storagedRepositories = localStorage.getItem('@github:repositories')

        if(storagedRepositories) {
            return JSON.parse(storagedRepositories)
        }
        return []
    })

    useEffect(()=>{

        localStorage.setItem('@github:repositories', JSON.stringify(repositories))
    }, )

    useEffect(()=> {
        localStorage.setItem('@github:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddRepository(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault()

        if (!newRepo) {
            setInputError('Type the repository name')
            return
        }

        try {

            const response = await api.get<Repository>(`repos/${newRepo}`)

            const repository = response.data

            setRepositories([...repositories, repository])

            setNewRepo('')
            setInputError('')
        } catch {
            setInputError('Error when searching for this repository')
        }

    }

    return(
        <>
            <img src={logoImg} alt="Github Explorer"/>
            <Title>Explore Github Repositories </Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input value={newRepo} onChange={e => setNewRepo(e.target.value)} placeholder="Type the repository name"></input>
                <button type="submit">Search</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository=>(
                    <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </Link>
                ))}



            </Repositories>
        </>
    )
}

export default Dashboard