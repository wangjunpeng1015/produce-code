var ejs = require('ejs'),
    _ = require('lodash')
let temp = `
package com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.Date;
import com.domita.backend.common.entity.BaseEntity;

/**
 * <%- _displayName -%>实体模型
 * Domita
 */
@Entity
@Table(name = "<%- _lowerName -%>")
@Data
public class <%- _uperName -%>Entity extends BaseEntity {
  <% for (let i = 0; i < _fields.length;i ++) { %>
    <% let _field = _fields[i] %>
    <% let _tempData = _field._dataType._code %>
    // <%- _field._displayName -%>
    <% if(_field._dataType._code === 'FK_Dict'){ %>
      <% _tempData = 'String'; %>
    <% } %>
    <% if(_field._dataType._code === 'FK_Model'){ %>
      <% _tempData = 'Integer'; %>
    <% } %>
    private <%- _tempData -%> <%- _field._camel_name -%>; 
  <% } %>
    
  <% for (let i = 0; i < _fields.length;i ++) { %>
    <% let _field = _fields[i] %>
    <% let _tempData = _field._dataType._code %>
    // <%- _field._displayName -%>
    <% if(_field._dataType._code === 'FK_Dict'){ %>
      <% _tempData = 'String'; %>
    <% } %>
    <% if(_field._dataType._code === 'FK_Model'){ %>
      <% _tempData = 'Integer'; %>
    <% } %>
    <% let _fieldUpperName = _field._camel_name.charAt(0).toUpperCase()+ _field._camel_name.substr(1,_field._camel_name.lengh) %>    
    <% if(_field._dataType._code === 'FK_Dict'){ %>
      <% _tempData = 'String'; %>
    <% } %>
    @Basic
    @Column(name = "<%- _field._name -%>")
    public <%- _tempData -%> get<%- _fieldUpperName -%>() {
        return <%- _field._camel_name -%>;
    }
    public void set<%- _fieldUpperName -%>(<%- _tempData -%> <%- _field._camel_name -%>) {
        this.<%- _field._camel_name -%> = <%- _field._camel_name -%>;
    }    
  <% } %>


}
`
  const entity = {
    temp: temp,
    code: option => {
      return ejs.render(temp, option)
    }
  }
  module.exports = entity