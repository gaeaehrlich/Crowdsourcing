import React from "react";
import axios from 'axios';

import { AutoComplete} from 'antd';
import { Tag } from 'antd';
import { Row, Col } from 'antd';



class DishPage extends React.Component {

    state = {
        dishes: [],
        area: '',
        init_tags: ['Asian', 'Vegan', 'Vegetarian',  'Shit', 'Kosher', 'PeanutsFree'],
        possible_tags: [],
        tags: [],
        init_areas: ['Tel Aviv', 'City Center', 'City North'],
        possible_areas: [],
        areas: [],
        reviews: []
    };

    setTags = obj => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/tag`).then(res => {
            temp = res.data.map(tag=>tag['title']);
            this.setState({
                init_tags: temp
            });
        });
    };

    setCityAreas = obj => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/cityarea`).then(res => {
            temp = res.data.map(tag=>tag['name']);
            this.setState({
                init_areas: temp
            });
        });
    };

    componentDidMount() {
        this.setTags();
        this.setCityAreas()

        // const dishID = this.props.match.params.dishID
        // this.setState({
        //     dish_id: dishID
        // });
        // axios.get(`http://127.0.0.1:8000/api/dish/${dishID}`).then(res => {
        //     console.log(res.data);
        //     this.setState({
        //         dish_name: res.data.title,
        //         restaurant_name: res.data.restaurant.name,
        //         // address: res.data.restaurant.street.name,
        //         price: res.data.price,
        //         reviews: res.data.reviews,
        //
        //     });
        // });
    }


    onSetTag = tag => {
        this.setState(state => {
            const tags = state.tags.concat(tag);
            return {tags,};
        });
    };

    handleCloseTag = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

      onSearchTag = searchText => {
    this.setState({
      possible_tags: !searchText ? [] : this.state.init_tags.filter(tag => tag.startsWith(searchText)),
    });
  };

      onSetArea = area => {
        this.setState(state => {
            const areas = state.areas.concat(area);
            return {areas,};
        });
    };

    handleCloseArea = removedArea => {
        const areas = this.state.areas.filter(area => area !== removedArea);
        console.log(areas);
        this.setState({ areas });
    };

      onSearchArea = searchText => {
    this.setState({
      possible_areas: !searchText ? [] : this.state.init_areas.filter(area => area.startsWith(searchText)),
    });
  };


    render() {
        return(
            <dom>
                <Row>
                    <Col>
                        <AutoComplete
                            dataSource={this.state.possible_tags}
                            style={{ width: 400 }}
                            onSelect={this.onSetTag}
                            onSearch={this.onSearchTag}
                            placeholder="Tags"
                        />
                    </Col>

                    <Col>
                        {this.state.tags.map((tag) =>
                            <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AutoComplete
                            dataSource={this.state.possible_areas}
                            style={{ width: 200 }}
                            onSelect={this.onSetArea}
                            onSearch={this.onSearchArea}
                            placeholder="Areas"
                        />
                    </Col>

                    <Col>
                        {this.state.areas.map((area) =>
                            <Tag key={area} closable onClose={() => this.handleCloseArea(area)}>{area}</Tag>
                        )}
                    </Col>
                </Row>
            </dom>
        )
    }
}
export default DishPage;