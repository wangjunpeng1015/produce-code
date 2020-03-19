var ejs = require('ejs'),
    _ = require('lodash')
let temp = `
package com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.controller;

import com.domita.backend.common.domain.BaseResponse;
import com.domita.backend.common.domain.PageResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.entity.<%- _uperName -%>Entity;
import com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.domain.<%- _uperName -%>Domain;
import com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.repository.<%- _uperName -%>Repository;
import com.domita.backend.businese.<%- _moduleName -%>.<%- _lowerName -%>.service.<%- _uperName -%>Service;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import com.domita.backend.common.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.domita.backend.common.util.BeanUtil;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;

import java.util.List;

/**
 * <%- _displayName -%> 模型接口控制器
 * Domita
 */
@RestController
@Api(description ="<%- _displayName -%>")
@RequestMapping("/<%- _moduleName -%>/<%- _lowerName -%>")
public class <%- _uperName -%>Controller {

    @Autowired
    private <%- _uperName -%>Service <%- _lowerName -%>Service;

    @Autowired
    private <%- _uperName -%>Repository <%- _lowerName -%>Repository;    

    private ModelMapper modelMapper = new ModelMapper();

    /**
     * 返回所有列表
     * 
     */
    @GetMapping("/list")
    @ApiOperation("query all <%- _uperName -%>")
    @PreAuthorize("@pms.hasPermission('<%- _uperName -%>:list')")
    public BaseResponse<List<<%- _uperName -%>Domain>> list() {
        Sort sort = new Sort(Sort.Direction.DESC,"id");
        List<<%- _uperName -%>Entity> all = <%- _lowerName -%>Repository.findAll(sort);
        List<<%- _uperName -%>Domain> list = modelMapper.map(all, new TypeToken<List<<%- _uperName -%>Domain>>() {}.getType());
        return new BaseResponse(list);
    }

    /**
     * 创建实体模型
     * 
     */
    @PostMapping
    @ApiOperation("create <%- _uperName -%>")
    @PreAuthorize("@pms.hasPermission('<%- _uperName -%>:create')")
    public BaseResponse create(@RequestBody <%- _uperName -%>Domain <%- _lowerName -%>) {
      <%- _uperName -%>Entity entity =JsonUtil.fromJson(JsonUtil.toJsonString(<%- _lowerName -%>),<%- _uperName -%>Entity.class);
      <%- _lowerName -%>Repository.save(entity);
      return BaseResponse.instance();
    }

    @PutMapping
    @ApiOperation("update <%- _uperName -%>")
    @PreAuthorize("@pms.hasPermission('<%- _uperName -%>:update')")
    public BaseResponse update(@RequestBody <%- _uperName -%>Domain <%- _lowerName -%>) {
      <%- _uperName -%>Entity <%- _lowerName -%>Entity = modelMapper.map(<%- _lowerName -%>, <%- _uperName -%>Entity.class);
        <%- _lowerName -%>Repository.saveAndFlush(<%- _lowerName -%>Entity);
        return BaseResponse.instance();
    }

    /**
     * 根据Id获取详细信息
     * 
     */
    @GetMapping("/{id}")
    @ApiOperation(value = "通过id查询数据对象详情信息", consumes = "GET", response = <%- _uperName -%>Entity.class)
    @PreAuthorize("@pms.hasPermission('<%- _uperName -%>:detail')")
    public BaseResponse<<%- _uperName -%>Domain> findById(@PathVariable("id") Integer id) {
      <%- _uperName -%>Domain <%- _lowerName -%>Domain = modelMapper.map(<%- _lowerName -%>Repository.findById(id).get(), <%- _uperName -%>Domain.class);
      return new BaseResponse<>(<%- _lowerName -%>Domain);
    }

    /**
     * 根据id删除实体
     * 
     */
    @DeleteMapping("/{id}")
    @ApiOperation("通过id删除数据，批量或单条")
    @PreAuthorize("@pms.hasPermission('<%- _uperName -%>:delete')")
    public BaseResponse delete(@PathVariable("id") List<Integer> id) {
      <%- _lowerName -%>Services.deleteByIds(id);
      return new BaseResponse();
    }    

    /**
     * 获取分页列表
     * 
     */
    @GetMapping("/pagelist/{pageSize}/{pageNo}")
    @ApiOperation("分页查询对象数据信息")
    @PreAuthorize("@pms.hasPermission('<%- _uperName -%>:list')")
    public BaseResponse<PageResult<<%- _uperName -%>Entity>> page(@PathVariable("pageSize") int pageSize, @PathVariable("pageNo") int pageNo) {
      Page<<%- _uperName -%>Entity> page = <%- _lowerName -%>Repository.findAll(PageRequest.of(pageNo - 1, pageSize, Sort.Direction.DESC,"id"));
      PageResult<<%- _uperName -%>Entity> result = new PageResult<<%- _uperName -%>Entity>();
      result.setContent(page.getContent());
      result.setPageNo(pageNo);
      result.setPageSize(pageSize);      
      result.setTotalRecords(modelMapper.map(page.getTotalElements(), new TypeToken<List<<%- _uperName -%>Domain>>() {}.getType()));
      return new BaseResponse(result);
    }
}


`
  const controller = {
    temp: temp,
    code: option => {
      return ejs.render(temp, option)
    }
  }
  module.exports = controller