import React from 'react';
import './App.css';
import {ButtonGroup, Button, Col, Container, ListGroup, Row, ThemeProvider} from 'react-bootstrap';
import { ReactChartJs } from '@cubetiq/react-chart-js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: {},
            list: [],
            loading: false,
            pokemon: null
        };
    }
    nextPage (url){
        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    result: result,
                    list: result.results
                });
            });
    }
    getPokemon (url){
        this.setState({
            loading: true
        });
        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                setTimeout(()=>{
                    console.log('pokemon',result)
                    this.setState({
                        pokemon: result,
                        loading: false
                    })
                },300)

            });
    }
    getAbilities(abilities){
        const items = []
        console.log(abilities)
        for (const index in abilities) {
            items.push(
                <span key={abilities[index]['ability']['name']} className="badge bg-danger">
                    {abilities[index]['ability']['name']}
                </span>
            )
        }
        return items
    }
    getTypes(types){
        const items = []
        console.log(types)
        for (const index in types) {
            items.push(
                <span key={types[index]['type']['name']} className="badge bg-dark">
                    {types[index]['type']['name']}
                </span>
            )
        }
        return items
    }
    componentDidMount() {
        this.nextPage("https://pokeapi.co/api/v2/pokemon");
    }
    render() {
        const items = []
        const { result, list, loading, pokemon } = this.state;
        for (const index in list) {
            items.push(
                <ListGroup.Item key={list[index].name} action onClick={() => this.getPokemon(list[index].url)} >
                    {list[index].name}
                </ListGroup.Item>
            )
        }
        return (
            <ThemeProvider
                breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            >
                <Container>
                    <Row>
                        <Col className={'p-5'} sm={12} md={6}>
                            <Row>
                                <Col className={'text-center m-3'}>
                                    <img style={{width: '250px'}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png" alt=""/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className={'content-list'}>
                                    <ListGroup>
                                        {items}
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className={'text-center m-3'}>
                                    <ButtonGroup aria-label="Basic example">
                                        <Button disabled={!('previous' in result) || (result['previous'] === '' || result['previous'] === null)}
                                                variant="secondary"
                                                onClick={'previous' in result ? () => this.nextPage(result['previous']): null }>
                                            Previous
                                        </Button>
                                        <Button disabled={!('next' in result) || (result['next'] === '' || result['next'] === null)}
                                                variant="secondary"
                                                onClick={'next' in result ? () => this.nextPage(result['next']): null }>
                                            Next
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Col>

                        <Col className={'mt-5'} sm={12} md={6}>
                            <div className={'pokedex'}>
                                <div className={'pokedex-top'}>
                                    <div className="half-circle-top">
                                        <div className="half-circle-mini-top">
                                        </div>
                                    </div>
                                </div>
                                { loading?
                                    <div className={'loading'}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/188/188918.png" alt=""/>
                                    </div>:null
                                }
                                { !loading && pokemon?
                                    <div className={'view-pokemon'}>
                                        <Container>
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <img className={'img-pokemon'} src={pokemon['sprites']['other']['official-artwork']['front_default']} alt=""/>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <p className={'name-pokemon'}>{pokemon['name']}</p>
                                                            <p>Abilities:</p>
                                                            <div className={'abilities-pokemon'}>{this.getAbilities(pokemon['abilities'])}</div>
                                                            <p>Types:</p>
                                                            <div className={'abilities-pokemon'}>{this.getTypes(pokemon['types'])}</div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col>
                                                            <Row>
                                                                <Col xs={12} className={'text-center'}>
                                                                    <ReactChartJs chartConfig={{
                                                                        type: 'radar',
                                                                        options: {
                                                                            scales: {
                                                                                r: {
                                                                                    pointLabels: {
                                                                                        display: true // Hides the labels around the radar chart
                                                                                    },
                                                                                    ticks: {
                                                                                        display: false // Hides the labels in the middel (numbers)
                                                                                    }
                                                                                }
                                                                            },
                                                                            responsive: true,
                                                                            tooltips: {
                                                                                mode: 'index',
                                                                                intersect: false,
                                                                            },
                                                                            hover: {
                                                                                mode: 'nearest',
                                                                                intersect: true,
                                                                            },
                                                                            legend: {
                                                                                display: false
                                                                            },
                                                                            plugins: {
                                                                                legend: {
                                                                                    display: false
                                                                                }
                                                                            },
                                                                        },
                                                                        data: {
                                                                            datasets: [
                                                                                {
                                                                                    label: 'Part-time',
                                                                                    data: [pokemon['height'], pokemon['weight'], pokemon['base_experience']],
                                                                                    borderColor: 'rgb(220,53,69)',
                                                                                    backgroundColor: 'rgba(220,53,69,0.62)',
                                                                                }
                                                                            ],
                                                                            labels: ['Height', 'Weight', 'Experience'],
                                                                        },
                                                                    }} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>:null
                                }
                                <div className={'pokedex-botton'}>
                                    <div className="half-circle-bottom">
                                        <div className="half-circle-mini-bottom">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>


                </Container>

            </ThemeProvider>
        );
    }
}

export default App;
