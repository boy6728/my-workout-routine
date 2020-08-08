'use strict';

/**
 * 
 * @param {Object(HTML Element)} nodes 
 */
function DOM_HTMLCollection ( nodes ) {
    var i = 0,
        nodes_length = nodes.length;

    for ( i; i < nodes_length; i += 1 ) {
        this[ i ] = nodes[ i ];
    }

    // length is readonly
    Object.defineProperty( this, 'length', {
        get: function () {
            return nodes.length;
        }
    } );

    // This cannot be changed.
    Object.freeze( this );
}

DOM_HTMLCollection.prototype = {
    item: function ( i ) {
        return this[ i ] != null ? this[ i ] : null;
    },
    namedItem: function ( name ) {
        for ( var i = 0; i < this.length; i += 1 ) {
            if ( this[ i ].id === name || this[ i ].name === name )
                return this[ i ];
        }

        return null;
    }
};


function DOM () {

    // DOM Properties.
    this.elements = {};
    this.selector = '';

    this.cloneProperty = {
        'elements': undefined,
        'selector': undefined
    };


    /** Get html elements */
    this._$ = function ( name ) {
        var elements,
            selector = '',
            prefix = '',
            element_name = '';

        if ( typeof name === 'object' ) prefix = 'object';
        else {
            prefix = name.charAt( 0 ),
            element_name = name.slice( 1 );
        }

            switch ( prefix ) {
                case '.':
                    elements = document.getElementsByClassName( element_name );
                    selector = 'class';
                    break;
    
                case '#':
                    elements = document.getElementById( element_name );
                    selector = 'id';
                    break;

                case 'object':
                    elements = name; // The name parameter is HTML Collection.

                    if ( typeof name.id !== 'undefined' ) selector = 'id';
                    else selector = 'class';

                    break;
    
                default:
                    return false;
        }


        this.elements = elements;
        this.selector = selector;

        return this;
    };


    /**
     * Apply DOM APIs in namespace format.
     * @param {*} function_name 
     */
    this._applyElements = function ( function_name ) {

        var elements = this.elements,
            args = Array.prototype.slice.call( arguments, 1 ),
            namespaces = function_name.split( '.' ),
            func = namespaces.pop(),
            namespace_length = namespaces.length,
            j = 0;

        if ( this.selector === 'class' ) {
            var i = 0,
                elements_length = elements.length;

            for ( i; i < elements_length; i += 1 ) {
                var element = elements[ i ];

                for ( j; j < namespace_length; j += 1 ) {
                    var namespace = namespaces[ i ];
        
                    element = element[ namespace ];
                }

                // Function or String
                if ( typeof element[ func ] === 'function' )
                    element[ func ].apply( element, args );
                else if ( typeof element[ func ] === 'string' )
                    element[ func ] = args;
            }
        }
        else if ( this.selector === 'id' ) {
            for ( j; j < namespace_length; j += 1 ) {
                var namespace = namespaces[ i ];
    
                elements = elements[ namespace ];
            }

            // Function or String
            if ( typeof elements[ func ] === 'function' )
                elements[ func ].apply( elements, args );
            else if ( typeof elements[ func ] === 'string' )
                elements[ func ] = args;
        }
    };


    /** Set style height to html elements */
    this.height = function ( value ) {
        this._applyElements( 'style.height', value );

        return this;
    };


    /** Set style margin-top */
    this.marginTop = function ( value ) {
        this._applyElements( 'style.marginTop', value );
    };


    /**
     * Set display to..
     * @param {*} bool 
     */
    this.display = function ( value ) {
        this._applyElements( 'style.display', value );
    }


    /**
     * inner html.
     * @param {*} text 
     */
    this.text = function ( text ) {
        this._applyElements( 'innerHTML', text );
    };

    
    /** Add event listener to Click */
    this.click = function ( func ) {
        this._applyElements( 'addEventListener', 'click', func );
    };


    /**
     * Add event listener to Submit.
     * @param {*} func 
     */
    this.submit = function ( func ) {
        this._applyElements( 'addEventListener', 'submit', func );
    };


    /** Get data by Html object */
    this.data = function ( name ) {
        var elements = this.elements,
            data;

        if ( typeof name === 'object' ) {

            var dataEntries = Object.entries( name );

            if ( this.selector === 'class' ) {
                var i = 0;
                for ( i; i < elements.length; i += 1 ) {
                    var element = elements[ i ];
                    for ( const [ key, value ] of dataEntries ) {
                        element.dataset[ key ] = value;
                    }
                }
            }
            else if ( this.selector === 'id' ) {
                for ( const [ key, value ] of dataEntries ) {
                    elements.dataset[ key ] = value;
                }
            }

        }
        else if ( typeof name === 'string' ) {

            if ( this.selector === 'class' ) {
                var i = 0;

                for ( i; i < elements.length; i += 1 ) {
                    var element = elements[ i ];

                    data = name === undefined ? element.dataset : element.dataset[ name ];
                }
            }
            else if ( this.selector === 'id' ) data = name === undefined ? elements.dataset : elements.dataset[ name ];

            return data;
        }

    }


    /**
     * Set value to input html object.
     * Get value if value is undefined.
     */
    this.value = function( value ) {
        var elements = this.elements;

        if ( typeof value === 'undefined' )
            return elements.value;
        else
            this._applyElements( 'value', value );
    };


    /**
     * Get data from form.
     */
    this.formData = function() {
        if ( this.selector === 'class' ) {
            console.log( 'DOM.js Error: formData cannot use class selector.' );
            return false;
        } 

        var elements = this.elements,
            fields = elements.querySelectorAll( '[name]' ),
            fields_length = fields.length,
            i = 0,
            data = {};

        for ( i; i < fields_length; i += 1 ) {
            var field = fields[ i ];

            data[ field.name ] = field.value;
        }

        return data;
    };


    /**
     * Added HTML element from parent container.
     * @param {string} html 
     */
    this.add = function ( html ) {
        var elements = this.elements;
        
        if ( typeof html === 'string' ) {
            var container = document.createElement( 'div' );

            container.innerHTML = html;

            if ( this.selector === 'class' ) {
                var i = 0,
                    elements_length = elements.length;
    
                for ( i; i < elements_length; i += 1 ) {
                    var element = elements[ i ];
    
                    while ( container.children.length > 0 )
                        element.appendChild( container.children[ 0 ] );
                }
            }
            else if ( this.selector === 'id' ) {
                while ( container.children.length > 0 )
                    elements.appendChild( container.chidlren[ 0 ] );
            }
        }

        else if ( typeof html === 'object' ) {

            if ( this.selector === 'class' ) {
                var i = 0,
                    elements_length = elements.length;

                for ( i; i < elements_length; i += 1 ) {
                    var element = elements[ i ];

                    element.appendChild( html );
                }
            }
            else if ( this.selecotr === 'id' ) {
                elements.appendChild( html );
            }

        }

        return this;
    };


    /**
     * 
     * @param {String, Object(HTML Element)} container 
     */
    this.appendTo = function ( parent ) {
        var _this = this;

        ( function ( resolve ) {
            // Save property to parent element from dom.
            var property = new Object();

            if ( _this.cloneProperty.elements === undefined ) {
                property.elements = _this.elements;
                property.selector = _this.selector;
            }
            else {
                property.elements = _this.cloneProperty.elements;
                property.selector = _this.cloneProperty.selector;
            }

            _this._$( parent );

            // Callback.
            resolve( property );
        } )(
            // Callback function.
            function ( domProperties ) {
                var parents = _this.elements,

                    appendElement = function ( parent ) {
                    var elements = domProperties.elements;

                    if ( domProperties.selector === 'class' ) {
                        var i = 0,
                            elements_length = elements.length;

                        for ( i; i < elements_length; i += 1) {
                            var element = elements[ i ];

                            parent.appendChild( element );
                        }
                    }

                    else if ( domProperties.selector === 'id' ) {
                        parent.appendChild( elements );
                    }
                };

                if ( _this.selector === 'class' ) {
                    var i = 0,
                        parents_length = parents.length;

                    for ( i; i < parents_length; i += 1 ) {
                        var parent = parents[ i ];

                        appendElement( parent );
                    }
                }

                else if ( _this.selector === 'id' ) {
                    appendElement( parents );
                }
            }

        );

        return this;
    };


    /**
     * Save the duplicated element to a property.
     */
    this.clone = function ( index, callback ) {
        var elements = this.elements;

        if ( this.selector === 'class' ) {

            var cloneNodes = [],
                i = 0;

            // The parameter index if is null.
            if ( index == null ) {
                var elements_length = elements.length;

                for ( i; i < elements_length; i += 1 ) {
                    var element = elements[ i ],
                        cloneElement = element.cloneNode( true );

                    if ( typeof callback === 'object' ) callback( cloneElement );

                    cloneNodes.push( cloneElement );
                }
            }
            // Else if is number.
            else if ( typeof index === 'number' ) {
                var cloneElement = elements[ index ].cloneNode( true );

                if ( typeof callback === 'object' ) callback( cloneElement );

                cloneNodes[ i ] = cloneElement;
            }

            this.cloneProperty.elements = new DOM_HTMLCollection( cloneNodes );
        }

        else if ( this.selector === 'id' ) {
            this.cloneProperty.elements = elements;
        }

        this.cloneProperty.selector = this.selector;

        return this;
    };


    /**
     * Modal UI
     */
    this.modal = function () {
        var modalEventlistener = this.elements,
            isModal = this._$( '.modal' ).elements.length === 0 ? undefined : this._$( '.modal' ).elements;

        if ( typeof isModal === 'object' ) {
            var _this = this;

            // Activate modal when an event(Click) occurs.
            this._$( modalEventlistener ).click( function () {
                var dataEntries = Object.entries( this.dataset );

                // Set input by modal
                for ( const [ key, value ] of dataEntries ) {
                    _this._$( '#' + key ).value( value );
                }
                
                // Display modal
                _this._$( '.modal' ).display( 'block' );
            } );

            // 클릭 이벤트에서 이미 .modal객체를 elements로 할당했기 때문에 _this로 사용
            this._$( '.close' ).click( function () {
                _this.display( 'none' );
            } );

        }
        else if ( typeof isModal === 'undefined' ) console.log( 'DOM.js Error: Modal is not undefined.' );
    };

};

let _dom = new DOM(),
    dom = function ( name ) { return _dom._$( name ) };



// 메서드 체인 문자열로 실행
// arguments: 해당 함수 인수의 배열 / 모든 함수에서 사용 가능한 지역 변수
// function executeFunctionByName( functionName, context ) {
    
//     var args = Array.prototype.slice.call( arguments, 2 ),
//         namespaces = functionName.split( '.' ),
//         func = namespaces.pop(),
//         i = 0;

//         for ( i; i < namespaces.length; i += 1 )
//             context = context[ namespaces[ i ] ];

//         return context[ func ].apply( context, args );
// }


