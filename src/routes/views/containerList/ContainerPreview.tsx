import React from "react";
import { Add24Filled } from '@fluentui/react-icons';
import { Button, FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { CheckmarkCircle24Filled, DismissCircle24Filled, Delete24Filled } from "@fluentui/react-icons";
import { TextField, ITextFieldStyles, getInputFocusStyle } from "@fluentui/react";

import ContainerMap from "../../containers/ContainerMap";
import './ContainerList.css'


const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: {
        height: 22,
        ':hover': {borderColor: '#7f85f5'},
        ':after': getInputFocusStyle('#4f52b2', '0'),
    },
    field: {
        fontSize: '13px',
    },
    subComponentStyles: {
        label: {
            root:{fontSize: '13px'},
        },
    },

    errorMessage: {
        position: 'absolute',
        top: 0,
        right: 0,
    }
};

export interface ContainerPreviewProps {
    container: ContainerMap | undefined;
    open?: (containerId: string) => void;
    close?: (containerId: string) => void;
    create?: (name: string, desc: string) => void;
    delete?: (containerId: string) => void;
}

/**
 * A preview of a fluid container.
 */
class ContainerPreview extends React.Component<ContainerPreviewProps> {
    static defaultProps = {
        container: undefined,
    };

    state = {
        formDisplayed: false,
        newName: 'New Collab Case',
        newDesc: '',
        isNameValid: true,
    };

    deleteRef = React.createRef<HTMLButtonElement>();
    
    /**
     * Updates the 'newName' state when the name input field changes, and validates the new name.
     * @param event - The event object from the change in the name input field.
     * @param newValue - The new value of the name input field.
     */
    handleNameInputChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, newValue?: string) => {
        this.setState({newName: newValue}, () => {
            this.validateName();
        }); 
    }

    /**
     * Event handler for changes in the description input field.
     * Updates 'newDesc' state with the new value.
     * @param event - The event object from the change in the description input field.
     * @param newValue - The new value of the description input field.
     */
    handleDescInputChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, newValue?: string) => {
        this.setState({newDesc: newValue});
    }

    /**
     * Validates the 'newName' state.
     * If 'newName' is an empty string, sets 'isNameValid' to false.
     * Otherwise, sets 'isNameValid' to true.
     */
    validateName = () => {
        const { newName: name } = this.state;
        this.setState({ isNameValid: name.trim() !== '' });
    }

    handleButtonClick = () => {
        this.props.create && this.props.create(this.state.newName, this.state.newDesc);
        // Reset the state to default values after create is called
        this.setState({ formDisplayed:false, newName: 'New Collaborative Case', newDesc: ''});
    }

    render() {
        const { container, create, open, close } = this.props;

        if (create === undefined && container === undefined)
            throw raiseGlobalError(new Error("ContainerPreview: Either container or create must be defined."));

        return (
            <div>
                {container &&
                    <div className="container" 
                        onMouseOver={() => {if (this.deleteRef.current) this.deleteRef.current.style.display = 'block'}}
                        onMouseOut={() => {if (this.deleteRef.current) this.deleteRef.current.style.display = 'none'}}
                    >
                        <img src={container.previewImage} alt='preview' />
                        <div className="display-area">
                            <h4>{container.name}</h4>
                            <p>{new Date(container.time).toLocaleString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                            {open && <Button id="open" onClick={() => open(container.id)}>Work Together</Button>}
                            {close && <Button id="close" onClick={() => close(container.id)}>Close</Button>}
                        </div>
                        <FluentProvider theme={teamsLightTheme}>
                            {this.props.delete && <Button 
                                className="containerListDeleteContainerButton" 
                                onClick={() => { this.props.delete!(container.id) }}
                                appearance="subtle"
                                ref={this.deleteRef}
                                icon={<Delete24Filled/>}
                                style={{display: 'none'}}
                            />}
                        </FluentProvider>
                    </div>
                }

                {!container && <div>
                    { !this.state.formDisplayed && <div className="new-container">
                        <Button
                            id="add-button"
                            appearance="primary"
                            icon={<Add24Filled/>}
                            onClick={() => {this.setState({formDisplayed: true})}}
                        />
                        <h4>New Collaborative Case</h4>
                    </div>}

                    {this.state.formDisplayed && <div className="container-form">
                        <TextField 
                            styles={textFieldStyles}
                            label="Name" 
                            value={this.state.newName}
                            maxLength={50} 
                            errorMessage={this.state.isNameValid ? '' : '(Name is required)'}
                            onChange ={this.handleNameInputChange} />
                        <TextField 
                            styles={textFieldStyles} 
                            label="Description" 
                            placeholder="Enter the description of collaborative case"
                            value={this.state.newDesc} 
                            maxLength={200} 
                            multiline rows={3} 
                            onChange ={this.handleDescInputChange}/>
                        <div className='button-list'>
                            <Button 
                                icon={<CheckmarkCircle24Filled color={this.state.isNameValid? "#5b5fc7" : "grey"}/>}
                                onClick={() => this.handleButtonClick()} 
                                disabled={!this.state.isNameValid}
                            />
                            <Button 
                                icon={<DismissCircle24Filled color="#d13438"/>}
                                onClick={() => {this.setState({formDisplayed: false})}}
                            />
                        </div>
                    </div>}
                </div>}
            </div>
        );
    }
}

export default ContainerPreview;