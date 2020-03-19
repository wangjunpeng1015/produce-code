var ejs = require('ejs'),
    _ = require('lodash')
let temp = `
package com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.domain;

import com.domita.backend.base.dict.domain.DictModel;
import java.util.Date;
import lombok.Data;

/**
 * <%- _displayName -%> Domain模型
 * Domita
 */
@Data
public class <%- _uperName -%>Domain {

    private Integer id;
  
  <%for (let i = 0; i < _fields.length;i ++) { -%>
    <% let _field = _fields[i] %>
    <% if(['create_time', 'update_time'].indexOf(_field._name) >= 0) { %>
      <% continue; %>
    <% } %>
    // <%- _field._displayName -%>
    <% let _tempData = _field._dataType._code %>
    <% if(_field._dataType._code === 'FK_Dict'){ %>
      <% _tempData = 'String'; %>
    // private DictModel <%- _field._camel_name_domain -%>; 
    <% } %> 
    <% if(_field._dataType._code === 'FK_Model'){ %>      
      <% _tempData = 'Integer' %>
    //  private Object <%- _field._camel_name_domain -%>;
    <% } %>    
    private <%- _tempData -%> <%- _field._camel_name -%>;         
  <%}-%>   
}
`
  const entity = {
    temp: temp,
    code: option => {
      return ejs.render(temp, option)
    }
  }
  module.exports = entity