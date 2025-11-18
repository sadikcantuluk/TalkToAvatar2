#!/usr/bin/env ruby
# Test script for Sualingo models and associations
# Run with: rails runner test_models.rb

puts "=" * 60
puts "Sualingo Models Test Script"
puts "=" * 60
puts

# Test 1: Check if all models are loaded
puts "1. Checking model loading..."
models = [User, Course, Subject, Report, Analysis, Video, Recording]
models.each do |model|
  begin
    model.count
    puts "  ✓ #{model.name} loaded successfully"
  rescue => e
    puts "  ✗ #{model.name} failed: #{e.message}"
  end
end
puts

# Test 2: Check User associations
puts "2. Testing User associations..."
begin
  user = User.first || User.create!(
    username: "test_user_#{Time.now.to_i}",
    email: "test_#{Time.now.to_i}@example.com",
    password: "Test1234",
    email_verified: true
  )
  puts "  ✓ User found/created: #{user.username}"
  
  # Check associations
  puts "  ✓ User has_many :courses: #{user.respond_to?(:courses)}"
  puts "  ✓ User has_many :videos: #{user.respond_to?(:videos)}"
  puts "  ✓ User has_many :recordings: #{user.respond_to?(:recordings)}"
rescue => e
  puts "  ✗ User test failed: #{e.message}"
  puts "  Backtrace: #{e.backtrace.first(3).join("\n  ")}"
end
puts

# Test 3: Create Course and test associations
puts "3. Testing Course creation and associations..."
begin
  user = User.first
  unless user
    puts "  ⚠ No user found, skipping course test"
  else
    course = user.courses.create!(
      title: "Test Course",
      description: "Test Description",
      language_code: "en",
      level: "A1",
      status: "active"
    )
    puts "  ✓ Course created: #{course.title} (ID: #{course.id})"
    
    # Check Course associations
    puts "  ✓ Course belongs_to :user: #{course.user_id == user.id}"
    puts "  ✓ Course has_many :subjects: #{course.respond_to?(:subjects)}"
    puts "  ✓ Course has_many :videos: #{course.respond_to?(:videos)}"
    puts "  ✓ Course has_many :reports: #{course.respond_to?(:reports)}"
    puts "  ✓ Course has_many :analyses: #{course.respond_to?(:analyses)}"
    puts "  ✓ Course has_many :recordings: #{course.respond_to?(:recordings)}"
    
    # Test Subject creation
    subject = course.subjects.create!(
      title: "Test Subject",
      description: "Test Subject Description",
      order: 1
    )
    puts "  ✓ Subject created: #{subject.title} (ID: #{subject.id})"
    puts "  ✓ Subject belongs_to :course: #{subject.course_id == course.id}"
    
    # Test Report creation
    report = course.reports.create!(
      title: "Test Report",
      content: "Test Report Content",
      report_type: "progress"
    )
    puts "  ✓ Report created: #{report.title} (ID: #{report.id})"
    puts "  ✓ Report belongs_to :course: #{report.course_id == course.id}"
    
    # Test Analysis creation
    analysis = course.analyses.create!(
      analysis_type: "performance",
      data: { score: 85, level: "A1" },
      summary: "Test Analysis Summary"
    )
    puts "  ✓ Analysis created: #{analysis.analysis_type} (ID: #{analysis.id})"
    puts "  ✓ Analysis belongs_to :course: #{analysis.course_id == course.id}"
    
    # Clean up test data
    analysis.destroy
    report.destroy
    subject.destroy
    course.destroy
    puts "  ✓ Test data cleaned up"
  end
rescue => e
  puts "  ✗ Course test failed: #{e.message}"
  puts "  Backtrace: #{e.backtrace.first(5).join("\n  ")}"
end
puts

# Test 4: Test Video with optional course
puts "4. Testing Video with optional course_id..."
begin
  user = User.first
  unless user
    puts "  ⚠ No user found, skipping video test"
  else
    # Video without course (existing behavior)
    video1 = user.videos.create!(
      text: "Test Video Text",
      status: "processing"
    )
    puts "  ✓ Video created without course: #{video1.id}"
    puts "  ✓ Video course_id is nil: #{video1.course_id.nil?}"
    
    # Video with course
    course = user.courses.create!(
      title: "Test Course for Video",
      language_code: "en",
      level: "A1"
    )
    video2 = user.videos.create!(
      text: "Test Video Text 2",
      status: "processing",
      course_id: course.id
    )
    puts "  ✓ Video created with course: #{video2.id}"
    puts "  ✓ Video course_id is set: #{video2.course_id == course.id}"
    puts "  ✓ Course has video: #{course.videos.include?(video2)}"
    
    # Clean up
    video2.destroy
    video1.destroy
    course.destroy
    puts "  ✓ Test data cleaned up"
  end
rescue => e
  puts "  ✗ Video test failed: #{e.message}"
  puts "  Backtrace: #{e.backtrace.first(5).join("\n  ")}"
end
puts

# Test 5: Test Recording with optional course
puts "5. Testing Recording with optional course_id..."
begin
  user = User.first
  unless user
    puts "  ⚠ No user found, skipping recording test"
  else
    # Recording without course (existing behavior)
    recording1 = user.recordings.create!(
      local_uri: "test://recording1",
      transcript: "Test transcript",
      reference_text: "Test reference",
      score: 85.5,
      level: "A1",
      language_code: "en"
    )
    puts "  ✓ Recording created without course: #{recording1.id}"
    puts "  ✓ Recording course_id is nil: #{recording1.course_id.nil?}"
    
    # Recording with course
    course = user.courses.create!(
      title: "Test Course for Recording",
      language_code: "en",
      level: "A1"
    )
    recording2 = user.recordings.create!(
      local_uri: "test://recording2",
      transcript: "Test transcript 2",
      reference_text: "Test reference 2",
      score: 90.0,
      level: "A1",
      language_code: "en",
      course_id: course.id
    )
    puts "  ✓ Recording created with course: #{recording2.id}"
    puts "  ✓ Recording course_id is set: #{recording2.course_id == course.id}"
    puts "  ✓ Course has recording: #{course.recordings.include?(recording2)}"
    
    # Clean up
    recording2.destroy
    recording1.destroy
    course.destroy
    puts "  ✓ Test data cleaned up"
  end
rescue => e
  puts "  ✗ Recording test failed: #{e.message}"
  puts "  Backtrace: #{e.backtrace.first(5).join("\n  ")}"
end
puts

# Test 6: Test cascade deletes
puts "6. Testing cascade deletes..."
begin
  user = User.first
  unless user
    puts "  ⚠ No user found, skipping cascade test"
  else
    course = user.courses.create!(
      title: "Test Course for Cascade",
      language_code: "en",
      level: "A1"
    )
    subject = course.subjects.create!(title: "Test Subject", order: 1)
    report = course.reports.create!(title: "Test Report", content: "Content", report_type: "test")
    analysis = course.analyses.create!(analysis_type: "test", data: { "test": "data" })
    
    subject_id = subject.id
    report_id = report.id
    analysis_id = analysis.id
    
    course.destroy
    
    # Check if related records are deleted
    if Subject.find_by(id: subject_id).nil? && 
       Report.find_by(id: report_id).nil? && 
       Analysis.find_by(id: analysis_id).nil?
      puts "  ✓ Cascade delete works: related records deleted"
    else
      puts "  ✗ Cascade delete failed: some records still exist"
    end
  end
rescue => e
  puts "  ✗ Cascade test failed: #{e.message}"
  puts "  Backtrace: #{e.backtrace.first(5).join("\n  ")}"
end
puts

# Test 7: Test validations
puts "7. Testing validations..."
begin
  user = User.first
  unless user
    puts "  ⚠ No user found, skipping validation test"
  else
    # Test Course validation
    invalid_course = user.courses.build(title: nil)
    if invalid_course.valid? == false
      puts "  ✓ Course validation works: title required"
    else
      puts "  ✗ Course validation failed: should require title"
    end
    
    # Test Subject validation
    course = user.courses.create!(title: "Test", language_code: "en", level: "A1")
    invalid_subject = course.subjects.build(title: nil)
    if invalid_subject.valid? == false
      puts "  ✓ Subject validation works: title required"
    else
      puts "  ✗ Subject validation failed: should require title"
    end
    
    course.destroy
  end
rescue => e
  puts "  ✗ Validation test failed: #{e.message}"
end
puts

puts "=" * 60
puts "Test completed!"
puts "=" * 60

