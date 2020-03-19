var ejs = require('ejs'),
    _ = require('lodash')
let temp = `
package com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.repository;

import com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.entity.<%- _uperName -%>Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * <%- _displayName -%> 模型数据层
 * Domita
 */
public interface <%- _uperName -%>Repository extends JpaRepository<<%- _uperName -%>Entity, Integer>, JpaSpecificationExecutor<<%- _uperName -%>Entity> {
  
  @Modifying
  @Transactional
  @Query(value = "delete from <%- _uperName -%>Entity a where a.id in (?1)")
  public void deleteByIds(List<Integer> ids);
}

`
  
  const repository = {
    temp: temp,
    code: option => {
      return ejs.render(temp, option)
    }
  }
  module.exports = repository