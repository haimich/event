module.exports = (grunt) ->
  grunt.initConfig
    watch:
      generate:
        files: ['event/**/*.yaml']
        tasks: ['generate-json']

  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask 'default', ['generate-json', 'watch']

  # Called by the exec-maven-plugin on build.
  grunt.registerTask 'maven', ['generate-json']

  # Called by Jenkins.
  grunt.registerTask 'ci', ['generate-json', 'validate-swagger']

  ONEJSON = 'static/event/event.json'
  grunt.registerTask 'generate-json', 'Generate all yaml file to one json', ->
    output_json =
      swagger: '2.0'
      info:
        title: ''
        description: ''
        version: '1.0.0'
      schemes: ['http']
      basePath: '/event/api'
      produces: ['application/json']
      consumes: ['application/json']
      paths: {}
      definitions: {}

    files = grunt.file.expand('event/**/*.yaml')
    for file in files
      parsed_yaml = grunt.file.readYAML(file)

      appendKeys = (attribute) ->
        for key, val of parsed_yaml[attribute]
          if output_json[attribute][key]?
            throw new Error("Attribute #{key} already exists")

          output_json[attribute][key] = val

      appendKeys('definitions')
      appendKeys('paths')

    grunt.file.write(ONEJSON, JSON.stringify(output_json, null, " "))
    console.log 'Generate swagger file successful'

  grunt.registerTask 'validate-swagger', 'Validates the one.json swagger definition', ->
    spec = require('swagger-tools').specs.v2
    swaggerObject = grunt.file.readJSON(ONEJSON)
    spec.validate swaggerObject, (err, result) ->
      throw err if err
      if result?
        {errors, warnings} = result
        write = (error) ->
          grunt.log.writeln "#/#{error.path.join '/'}: #{error.message}"
        
        errors.forEach(write)
        warnings.forEach(write)

        grunt.fatal "#{errors.length} validation errors." if errors.length
        grunt.warn "#{warnings.length} validation warnings." if warnings.length

      else
        grunt.log.ok 'Swagger validation successful.'
