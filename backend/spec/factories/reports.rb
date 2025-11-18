FactoryBot.define do
  factory :report do
    course { nil }
    title { "MyString" }
    content { "MyText" }
    report_type { "MyString" }
  end
end
